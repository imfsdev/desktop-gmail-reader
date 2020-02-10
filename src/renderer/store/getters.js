export default {
  mailCounts: state => {
    const result = {}
    state.accounts.forEach(acc => {
      result[acc.email] = 0
    })
    state.messages.forEach(msg => {
      if (!msg.read && result[msg.email] !== undefined) {
        result[msg.email]++
      }
    })
    return result
  },
  expiredEmails: state =>
    state.accounts.filter(acc => !acc.token).map(acc => acc.email),
  filteredMessages: state =>
    state.messages.filter(
      msg => !state.selected || msg.email === state.selected
    ),
  selectedAccount: state =>
    state.accounts.find(acc => acc.email === state.selected)
}
