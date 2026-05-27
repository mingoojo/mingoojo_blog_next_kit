#!/usr/bin/env python3
"""
MATLAB vs Java JSON 비교 도구

블로그 글 "MATLAB → Java 포팅, 결과를 어떻게 검증할 것인가" 의 검증 스크립트.

사용 예시:
    # 자동 비교 (기본) — 키 이름 자동 매칭 (camelCase ↔ snake_case)
    python3 compare_json.py state_java.json state_matlab.json

    # 명시적 필드 매핑
    python3 compare_json.py --map gs:gs,prnFull:prn_full a.json b.json

    # MATLAB 2D 매트릭스 reshape (column-major flatten 해제)
    python3 compare_json.py --reshape 10,41 a.json b.json

    # 상세 분석 (worst-case + 부호/상대오차)
    python3 compare_json.py --verbose a.json b.json

    # CSV 비교 모드
    python3 compare_json.py --csv java.csv matlab.csv

설치:
    Python 3.7+ 만 있으면 됨 (표준 라이브러리만 사용)
"""

import argparse
import json
import re
import statistics
from collections import defaultdict


# ─────────────────────────────────────────────────────────────────
# 키 이름 자동 매칭
# ─────────────────────────────────────────────────────────────────
def normalize_key(s):
    """키 이름을 정규화: camelCase, snake_case, UPPER 모두 같은 형태로"""
    # camelCase → snake_case
    s = re.sub(r'([a-z0-9])([A-Z])', r'\1_\2', s)
    # 소문자, _ 제거
    return s.lower().replace('_', '')


def find_match(key, candidate_keys):
    """key 와 의미가 같은 candidate 찾기 (정규화 매칭)"""
    target = normalize_key(key)
    for ck in candidate_keys:
        if normalize_key(ck) == target:
            return ck
    return None


# ─────────────────────────────────────────────────────────────────
# Helper 함수들
# ─────────────────────────────────────────────────────────────────
def is_nan(v):
    """NaN 안전 체크"""
    if v is None or isinstance(v, bool):
        return False
    try:
        return v != v
    except TypeError:
        return False


def is_number(v):
    """숫자(bool 제외)인지"""
    return isinstance(v, (int, float)) and not isinstance(v, bool)


def reshape_column_major(flat_list, dims):
    """
    MATLAB column-major flatten 해제 (2D)
    예: dims=(10, 41) → m[epoch][station]
    """
    if len(dims) != 2:
        raise ValueError("현재 2D reshape만 지원")
    rows, cols = dims
    expected = rows * cols
    if len(flat_list) != expected:
        raise ValueError(
            f"길이 불일치: flat={len(flat_list)}, expected={expected} (={rows}*{cols})"
        )
    result = [[None] * cols for _ in range(rows)]
    for r in range(rows):
        for c in range(cols):
            result[r][c] = flat_list[c * rows + r]
    return result


def parse_field_map(arg):
    """'gs:gs,prnFull:prn_full' 같은 문자열을 dict 로"""
    if not arg:
        return None
    result = {}
    for pair in arg.split(','):
        if ':' in pair:
            j, m = pair.split(':', 1)
            result[j.strip()] = m.strip()
    return result


# ─────────────────────────────────────────────────────────────────
# 비교 로직 — 자동 키 매칭, 재귀 walk
# ─────────────────────────────────────────────────────────────────
class ComparisonResult:
    """비교 결과 누적기"""

    def __init__(self, explicit_map=None):
        self.explicit_map = explicit_map        # 명시적 매핑 (있으면 우선)
        self.diffs = defaultdict(list)          # path → [|diff|, ...]
        self.values = defaultdict(list)         # path → [(j, m), ...]
        self.num_compared = 0
        self.nan_mismatch_paths = []
        self.unmatched_keys = []                # 매칭 못한 key
        self.structural_mismatch = []           # list 길이 불일치 등

    def walk(self, jv, mv, path=''):
        """재귀적으로 두 구조를 따라가며 비교"""

        # 둘 다 dict
        if isinstance(jv, dict) and isinstance(mv, dict):
            self._walk_dict(jv, mv, path)
            return

        # 둘 다 list
        if isinstance(jv, list) and isinstance(mv, list):
            self._walk_list(jv, mv, path)
            return

        # 숫자 비교
        if is_number(jv) and is_number(mv):
            self._compare_number(jv, mv, path)
            return

        # NaN 체크 (양쪽 다 NaN 이면 OK)
        if is_nan(jv) and is_nan(mv):
            return
        if is_nan(jv) != is_nan(mv):
            self.nan_mismatch_paths.append(path)
            return

        # 문자열
        if isinstance(jv, str) and isinstance(mv, str):
            return   # skip (값 비교 안 함)

        # 타입 불일치
        if type(jv) is not type(mv):
            self.structural_mismatch.append(
                f'{path}: type({type(jv).__name__}) != type({type(mv).__name__})'
            )

    def _walk_dict(self, jd, md, path):
        m_keys = list(md.keys())

        for jk, jv in jd.items():
            # 명시적 매핑이 있으면 사용
            if self.explicit_map and jk in self.explicit_map:
                mk = self.explicit_map[jk]
                if mk not in md:
                    self.unmatched_keys.append(f'{path}/{jk} → {mk} (MATLAB에 없음)')
                    continue
            else:
                # 자동 매칭
                mk = find_match(jk, m_keys)
                if mk is None:
                    self.unmatched_keys.append(f'{path}/{jk} (자동 매칭 실패)')
                    continue

            new_path = f'{path}/{jk}' if path else jk
            self.walk(jv, md[mk], new_path)

    def _walk_list(self, jl, ml, path):
        if len(jl) != len(ml):
            self.structural_mismatch.append(
                f'{path}: len({len(jl)}) != len({len(ml)})'
            )
            # 짧은 쪽까지만 비교
        for i, (ji, mi) in enumerate(zip(jl, ml)):
            self.walk(ji, mi, f'{path}[{i}]')

    def _compare_number(self, jv, mv, path):
        # NaN
        if is_nan(jv) and is_nan(mv):
            return
        if is_nan(jv) != is_nan(mv):
            self.nan_mismatch_paths.append(path)
            return

        # 필드 path 마지막 토큰을 키로 사용 (배열 인덱스 제거)
        field = re.sub(r'\[\d+\]', '', path).split('/')[-1] or '(root)'
        d = abs(jv - mv)
        self.diffs[field].append(d)
        self.values[field].append((jv, mv))
        self.num_compared += 1

    # ─────────────────────────────────────────────────
    # 출력
    # ─────────────────────────────────────────────────
    def print_summary(self, verbose=False):
        print()
        print('=' * 70)
        print('  비교 결과')
        print('=' * 70)
        print(f'  Numeric values compared : {self.num_compared}')
        print(f'  Fields encountered      : {len(self.diffs)}')
        print(f'  NaN pattern mismatch    : {len(self.nan_mismatch_paths)}')
        print(f'  Structural mismatch     : {len(self.structural_mismatch)}')
        print(f'  Unmatched keys          : {len(self.unmatched_keys)}')

        if not self.diffs:
            print()
            print('  비교 가능한 수치 필드를 찾지 못함')
            print('  → --verbose 옵션으로 unmatched keys 확인 가능')
            if verbose:
                self._print_unmatched()
            return

        print()
        header = f'  {"field":<20s} {"max |Δ|":>14s} {"mean |Δ|":>14s} {"median":>14s} {"count":>8s}'
        print(header)
        print('  ' + '─' * (len(header) - 2))

        # 정렬: max |Δ| 큰 순
        sorted_fields = sorted(
            self.diffs.items(),
            key=lambda kv: -max(kv[1]) if kv[1] else 0
        )

        for f, ds in sorted_fields:
            if not ds:
                continue
            mx = max(ds)
            mn = statistics.mean(ds)
            md = statistics.median(ds)
            cnt = len(ds)
            print(f'  {f:<20s} {mx:>14.4e} {mn:>14.4e} {md:>14.4e} {cnt:>8d}')

        # Verdict
        print()
        max_overall = max(max(ds) for ds in self.diffs.values() if ds)
        print(f'  최대 절대 오차: {max_overall:.4e}')
        print(f'  판정: {self._verdict(max_overall)}')

        if verbose:
            self._print_worst_cases()
            self._print_extra_analysis()
            self._print_unmatched()
            self._print_structural()

    def _verdict(self, max_diff):
        if max_diff == 0:
            return '✓ 완전 일치 (입력 통과 가능성)'
        elif max_diff < 1e-14:
            return '✓ machine epsilon 수준 (OK)'
        elif max_diff < 1e-9:
            return '✓ 부동소수점 노이즈 (OK)'
        elif max_diff < 1e-6:
            return '⚠ 알고리즘 미세 차이 (조사 권장)'
        elif max_diff < 1e-3:
            return '🔍 버그 가능성 (조사 필요)'
        else:
            return '🐛 인덱스/부호/단위 오류 의심'

    def _print_worst_cases(self, n=3):
        print()
        print('  Worst-case 위치 (필드당 상위 3개):')
        any_shown = False
        for f, pairs in self.values.items():
            if not pairs:
                continue
            indexed = list(enumerate(pairs))
            indexed.sort(key=lambda ip: -abs(ip[1][0] - ip[1][1]))
            top = [(i, jm) for i, jm in indexed[:n] if abs(jm[0] - jm[1]) > 1e-14]
            if not top:
                continue
            any_shown = True
            print(f'    [{f}]')
            for i, (jv, mv) in top:
                d = jv - mv
                print(f'      idx={i:6d}  java={jv:>15.6g}  matlab={mv:>15.6g}  diff={d:>+15.6e}')
        if not any_shown:
            print('    (모든 값이 1e-14 이내 일치)')

    def _print_extra_analysis(self):
        print()
        print('  추가 분석:')
        for f, pairs in self.values.items():
            if not pairs:
                continue
            sign_match = sum(
                1 for j, m in pairs
                if (j > 0) == (m > 0) or (abs(j) < 1e-14 and abs(m) < 1e-14)
            )
            sign_pct = 100.0 * sign_match / len(pairs)
            rel_errs = [
                abs(j - m) / abs(m)
                for j, m in pairs
                if abs(m) > 1.0
            ]
            if rel_errs:
                rel_max = max(rel_errs)
                rel_med = statistics.median(rel_errs)
                print(f'    [{f:<14s}] sign: {sign_pct:5.1f}%,  '
                      f'rel err: max={rel_max:.2e}, median={rel_med:.2e}')
            else:
                print(f'    [{f:<14s}] sign: {sign_pct:5.1f}%')

    def _print_unmatched(self):
        if not self.unmatched_keys:
            return
        print()
        print(f'  매칭되지 않은 키 ({len(self.unmatched_keys)}개, 최대 20개):')
        for k in self.unmatched_keys[:20]:
            print(f'    {k}')
        if len(self.unmatched_keys) > 20:
            print(f'    ... 외 {len(self.unmatched_keys) - 20}개')

    def _print_structural(self):
        if not self.structural_mismatch:
            return
        print()
        print(f'  구조적 불일치 ({len(self.structural_mismatch)}개, 최대 10개):')
        for s in self.structural_mismatch[:10]:
            print(f'    {s}')


# ─────────────────────────────────────────────────────────────────
# CSV 비교
# ─────────────────────────────────────────────────────────────────
def compare_csv(java_csv, matlab_csv):
    import csv

    def load(path):
        with open(path) as f:
            r = csv.reader(f)
            header = next(r)
            rows = list(r)
        return header, rows

    hj, jrows = load(java_csv)
    hm, mrows = load(matlab_csv)

    print()
    print('=' * 70)
    print('  CSV 비교')
    print('=' * 70)
    print(f'  Header match  : {hj == hm}')
    if hj != hm:
        print(f'    Java   : {hj}')
        print(f'    MATLAB : {hm}')
    print(f'  Java rows     : {len(jrows)}')
    print(f'  MATLAB rows   : {len(mrows)}')

    if len(jrows) != len(mrows):
        print('  ⚠ 행 수 불일치 — 비교 중단')
        return

    def parse(v):
        if v in ('NaN', 'nan', ''):
            return float('nan')
        try:
            return float(v)
        except ValueError:
            return None

    n_cols = len(hj)
    col_diffs = [[] for _ in range(n_cols)]
    nan_mismatch_per_col = [0] * n_cols

    for jr, mr in zip(jrows, mrows):
        for c in range(min(len(jr), len(mr), n_cols)):
            jv, mv = parse(jr[c]), parse(mr[c])
            if jv is None or mv is None:
                continue
            j_nan = is_nan(jv)
            m_nan = is_nan(mv)
            if j_nan != m_nan:
                nan_mismatch_per_col[c] += 1
                continue
            if j_nan:
                continue
            col_diffs[c].append(abs(jv - mv))

    print()
    print(f'  {"column":<24s} {"max |Δ|":>12s} {"mean |Δ|":>12s} {"NaN mis":>10s}')
    print('  ' + '─' * 60)
    for c in range(n_cols):
        if not col_diffs[c]:
            continue
        col_name = hj[c] if c < len(hj) else f'col{c}'
        mx = max(col_diffs[c])
        mn = statistics.mean(col_diffs[c])
        print(f'  {col_name:<24s} {mx:>12.4e} {mn:>12.4e} {nan_mismatch_per_col[c]:>10d}')


# ─────────────────────────────────────────────────────────────────
# 메인
# ─────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(
        description='MATLAB vs Java JSON 결과 비교 (자동 키 매칭)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
예시:
  # 자동 비교 (기본)
  python3 compare_json.py state_java.json state_matlab.json

  # 명시적 필드 매핑
  python3 compare_json.py --map "gs:gs,prnFull:prn_full" a.json b.json

  # MATLAB 2D 매트릭스 reshape
  python3 compare_json.py --reshape 10,41 a.json b.json

  # 상세 분석
  python3 compare_json.py --verbose a.json b.json

  # CSV 비교 모드
  python3 compare_json.py --csv java.csv matlab.csv

자동 키 매칭:
  - camelCase ↔ snake_case 자동 변환 (예: prnFull ↔ prn_full)
  - 대소문자 무시 (예: PR1 ↔ pr1)
  - 언더스코어 무시 (예: rho_f1 ↔ rhoF1)
        """
    )
    parser.add_argument('java_file', help='Java JSON 파일 (또는 --csv 시 Java CSV)')
    parser.add_argument('matlab_file', help='MATLAB JSON 파일 (또는 --csv 시 MATLAB CSV)')
    parser.add_argument('--map', default='',
                        help='명시적 필드 매핑 (예: "gs:gs,prn:prn_full"). 미지정 시 자동 매칭')
    parser.add_argument('--reshape', default='',
                        help='MATLAB column-major 매트릭스 reshape (예: "10,41")')
    parser.add_argument('--verbose', '-v', action='store_true',
                        help='worst-case + 부호/상대오차 + unmatched keys 출력')
    parser.add_argument('--csv', action='store_true',
                        help='CSV 비교 모드')

    args = parser.parse_args()

    if args.csv:
        compare_csv(args.java_file, args.matlab_file)
        return

    print(f'Loading: {args.java_file}')
    with open(args.java_file) as f:
        j = json.load(f)
    print(f'Loading: {args.matlab_file}')
    with open(args.matlab_file) as f:
        m = json.load(f)

    if args.reshape:
        dims = tuple(int(x) for x in args.reshape.split(','))
        print(f'Reshaping MATLAB: dims={dims} (column-major → row-major)')
        m = reshape_column_major(m, dims)

    explicit_map = parse_field_map(args.map)
    if explicit_map:
        print(f'Field map (explicit): {len(explicit_map)} entries')
    else:
        print('Field map: auto (camelCase ↔ snake_case)')

    result = ComparisonResult(explicit_map=explicit_map)
    result.walk(j, m)
    result.print_summary(verbose=args.verbose)


if __name__ == '__main__':
    main()
