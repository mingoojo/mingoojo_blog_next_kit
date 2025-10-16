// module.exports = {
//   semi: false,
//   singleQuote: true,
//   printWidth: 100,
//   tabWidth: 2,
//   useTabs: false,
//   trailingComma: 'es5',
//   bracketSpacing: true,
//   plugins: ['prettier-plugin-tailwindcss'],
//   htmlWhitespaceSensitivity: 'ignore', // HTML/JSX에서 줄바꿈 무시
// }
module.exports = {
  printWidth: 100, // 한 줄 최대 길이
  tabWidth: 2, // 탭 크기
  useTabs: false, // 스페이스 사용
  semi: false, // 세미콜론 여부
  singleQuote: true, // 작은따옴표 사용
  trailingComma: 'all', // 끝 콤마
  bracketSpacing: true, // 객체 { } 띄어쓰기
  bracketSameLine: true, // JSX에서 > 를 같은 줄에 두기
  endOfLine: 'lf', // 개행 문자
  htmlWhitespaceSensitivity: 'ignore', // HTML/JSX에서 줄바꿈 무시
  singleAttributePerLine: false,
}
