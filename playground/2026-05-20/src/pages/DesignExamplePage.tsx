import {
  Button,
  Modal,
  Input,
  Badge,
  Card,
  Spinner,
  Divider,
  Checkbox,
  Select,
  Text,
  LinkText,
  Toggle,
  RadioGroup,
} from '@/design-system'
import { useUiStore } from '@/store'
import { useState } from 'react'

export default function DesignExamplePage() {
  const addToast = useUiStore((state) => state.addToast)

  const [isOpen, setIsOpen] = useState(false)
  const [mapType, setMapType] = useState('normal')

  return (
    <>
      <div className="flex flex-col gap-4 p-8">
        <Button variant="primary">결제하기</Button>
        <Button variant="outline-primary">버튼</Button>
        <Button variant="secondary">취소</Button>
        <Button variant="outline">더보기</Button>
        <Button variant="ghost">닫기</Button>
        <Button variant="danger">삭제</Button>
        <Button variant="primary" size="sm">
          작은 버튼
        </Button>
        <Button variant="primary" size="lg">
          큰 버튼
        </Button>
        <Button variant="primary" isLoading>
          처리 중
        </Button>
        <Button variant="primary" disabled>
          비활성
        </Button>
      </div>
      <div className="flex flex-col gap-6 p-8 max-w-md">
        <Input label="이메일" placeholder="example@email.com" />
        <Input label="비밀번호" type="password" helperText="8자 이상 입력해주세요" />
        <Input label="카드번호" errorMessage="유효하지 않은 카드번호입니다" />
        <Input label="비활성" disabled placeholder="입력 불가" />
      </div>

      <div className="flex flex-col gap-4 p-8">
        <Button onClick={() => addToast({ type: 'success', message: '결제가 완료되었습니다.' })}>
          성공 토스트
        </Button>
        <Button
          variant="danger"
          onClick={() => addToast({ type: 'error', message: '결제에 실패했습니다.' })}>
          에러 토스트
        </Button>
        <Button
          variant="secondary"
          onClick={() => addToast({ type: 'warning', message: '카드 한도를 확인해주세요.' })}>
          경고 토스트
        </Button>
        <Button
          variant="outline"
          onClick={() => addToast({ type: 'info', message: '결제 처리 중입니다.' })}>
          정보 토스트
        </Button>
      </div>

      <div className="p-8">
        <Button onClick={() => setIsOpen(true)}>모달 열기</Button>

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="결제 확인"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                취소
              </Button>
              <Button variant="primary" onClick={() => setIsOpen(false)}>
                결제하기
              </Button>
            </>
          }>
          <p className="text-text-secondary">총 결제 금액은 50,000원입니다. 진행하시겠습니까?</p>
        </Modal>
      </div>

      <div className="flex flex-col gap-6 p-8">
        {/* Badge */}
        <div className="flex gap-2">
          <Badge variant="success">결제 완료</Badge>
          <Badge variant="error">결제 실패</Badge>
          <Badge variant="warning">처리 중</Badge>
          <Badge variant="info">대기</Badge>
          <Badge variant="default">취소</Badge>
        </div>

        {/* Card */}
        <Card padding="lg" variant="panel">
          내용
        </Card>
        {/* // Card 2 — 플로팅 카드 (모달, 폼 등) */}
        <Card padding="lg" variant="form">
          내용
        </Card>

        {/* // 기존 방식 그대로도 동작 */}
        <Card padding="md" bordered shadow>
          내용
        </Card>

        {/* Spinner */}
        <div className="flex gap-4 items-center">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </div>

      <div className="flex flex-col gap-6 p-8 max-w-md">
        <Divider />
        <Divider label="또는" />

        <Checkbox label="이용약관에 동의합니다" />
        <Checkbox label="전액 결제에 동의합니다" helperText="취소 시 환불 불가" />
        <Checkbox label="비활성" disabled />
        <Checkbox label="에러" errorMessage="필수 동의 항목입니다" />

        <Checkbox
          id="terms"
          label={
            <span>
              <LinkText href="#">이용약관</LinkText> and{' '}
              <LinkText href="#">개인정보처리방침</LinkText>에 동의합니다
            </span>
          }
        />

        <Select
          label="카드사 선택"
          placeholder="카드사를 선택하세요"
          options={[
            { value: 'shinhan', label: '신한카드' },
            { value: 'kb', label: 'KB국민카드' },
            { value: 'hyundai', label: '현대카드' },
          ]}
        />
        <Select
          label="할부"
          options={[
            { value: '0', label: '일시불' },
            { value: '3', label: '3개월' },
            { value: '6', label: '6개월' },
            { value: '12', label: '12개월' },
          ]}
          errorMessage="할부 선택은 필수입니다"
        />
      </div>
      <div className="flex flex-col gap-4 p-8">
        <Text variant="heading1">결제 페이지</Text>
        {/* 컬러 배경 위 텍스트 */}
        <div className="bg-primary p-4 rounded-lg">
          <Text variant="heading2">컬러 배경 제목</Text>
        </div>
        <Text variant="heading3">서브 섹션</Text>
        <Text variant="body1">메인 본문 텍스트입니다.</Text>
        <Text variant="body2">보조 본문 텍스트입니다.</Text>
        <Text variant="caption">작은 설명 텍스트</Text>
        <Text variant="label">라벨</Text>
        <Text variant="body1" color="error">
          에러 텍스트
        </Text>
        <Text variant="body1" color="success">
          성공 텍스트
        </Text>
        <LinkText variant="link1" href="#">
          본문 크기 링크
        </LinkText>
        <LinkText variant="link2" href="#">
          보조 크기 링크
        </LinkText>

        {/* // 밑줄 있음 */}
        <LinkText variant="link1" href="#" underline>
          약관 보기
        </LinkText>
        <LinkText variant="link2" href="#" underline>
          개인정보처리방침
        </LinkText>

        {/* // 볼드 정도 */}
        <LinkText variant="link1" href="#" font="head">
          약관 보기
        </LinkText>
        <LinkText variant="link2" href="#" font="caption">
          개인정보처리방침
        </LinkText>

        {/* 어두운 배경 위 회색 링크 */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <LinkText variant="link3" href="#">
            약관 보기
          </LinkText>
        </div>
        <Toggle label="자동 결제 동의" />
        <Toggle label="마케팅 수신 동의" helperText="이벤트 및 혜택 알림을 받습니다" />
        <Toggle label="비활성" disabled />
        <Toggle size="sm" label="작은 토글" />
      </div>

      <div className="p-8">
        <RadioGroup
          label="지도 레이어"
          value={mapType}
          onChange={setMapType}
          options={[
            { value: 'normal', label: '일반' },
            { value: 'satellite', label: '위성' },
            { value: 'terrain', label: '지형' },
          ]}
        />
      </div>
    </>
  )
}
