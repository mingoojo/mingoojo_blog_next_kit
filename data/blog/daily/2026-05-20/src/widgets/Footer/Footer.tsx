export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* 브랜드 */}
          <div className="col-span-2 md:col-span-1">
            <div className="text-white font-bold text-lg mb-2">PPSOL</div>
            <div className="text-sm">CloudStore</div>
          </div>

          {/* 서비스 */}
          <div>
            <div className="text-white text-sm font-semibold mb-3">서비스</div>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  RINEX 다운로드
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  요금제
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* 고객지원 */}
          <div>
            <div className="text-white text-sm font-semibold mb-3">고객지원</div>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  공지사항
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  이용약관
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  개인정보처리방침
                </a>
              </li>
            </ul>
          </div>

          {/* 전화 */}
          <div>
            <div className="text-white text-sm font-semibold mb-3">전화</div>
            <ul className="flex flex-col gap-2 text-sm">
              <li>대표번호</li>
              <li className="text-white">000-0000-0000</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-xs text-center">
          © 2025 PPSOL CloudStore. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
