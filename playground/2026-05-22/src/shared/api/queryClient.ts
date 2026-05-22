import { QueryClient } from '@tanstack/react-query'

// queryClient라는 관리자 인스턴스를 생성하면서, '기본 규칙(defaultOptions)'을 정해줍니다.
export const queryClient = new QueryClient({
  defaultOptions: {
    // 1. queries: 서버에서 데이터를 '가져올 때(GET)'의 기본 규칙입니다.
    queries: {
      // staleTime (상쉰 시간, 즉 데이터가 신선하다고 인정되는 시간)
      // 1000ms(1초) * 60 * 5 = 300,000ms = 5분
      // 의미: "한 번 가져온 데이터는 5분 동안은 완전 최신(fresh)으로 취급할게!"
      // 효과: 5분 안에는 다른 페이지를 갔다 오더라도 서버에 다시 요청하지 않고, 저장해둔(캐싱된) 데이터를 바로 보여줍니다. (서버 부하 감소 및 속도 향상)
      staleTime: 1000 * 60 * 5,

      // retry (재시도 횟수)
      // 의미: "서버에서 데이터 가져오다 실패(에러)하면, 딱 1번만 더 몰래 다시 시도해 봐!"
      // 효과: 일시적인 네트워크 오류로 인한 에러 화면을 방지해 줍니다.
      retry: 1,

      // refetchOnWindowFocus (화면 포커스 시 재요청 여부)
      // 의미: "사용자가 다른 브라우저 탭을 보다가 다시 우리 앱 화면으로 돌아왔을 때, 데이터를 새로고침 하지 마!"
      // 효과: 기본값은 true인데, 이걸 끄면 불필요한 API 요청을 크게 줄일 수 있습니다. (실시간으로 바뀌는 주식, 코인 앱이 아니라면 보통 false로 많이 둡니다.)
      refetchOnWindowFocus: false,
    },

    // 2. mutations: 서버의 데이터를 '변경할 때(POST, PUT, DELETE)'의 기본 규칙입니다.
    mutations: {
      // retry (재시도 횟수)
      // 의미: "데이터 수정/생성/삭제 요청이 실패하면, 절대 다시 시도하지 마! (0번)"
      // 이유: 데이터를 가져오는 GET과 달리, '결제하기', '글 작성하기' 같은 요청(POST)을 에러 났다고 맘대로 재시도하면 결제가 두 번 되거나 글이 두 개 써지는 대참사가 발생할 수 있기 때문입니다.
      retry: 0,
    },
  },
})
