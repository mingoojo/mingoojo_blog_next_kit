module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      // prepare-commit-msg에서 [JIRA-123] 같은 prefix를 붙여도 통과하도록
      headerPattern: /^(\[.+\]\s)?(\w+):\s(.+)$/,
      headerCorrespondence: ['ticket', 'type', 'subject'],
    },
  },
}
