function smartMoneySignal(data) {
   let highBetUsers=0
  const highBetUser = data?.amount > 500&&data?.cashout_odd
  highBetUsers=highBetUsers+highBetUser
  const avgCashout = highBetUsers/ highBetUsers.length;
  return {"biguser":avgCashout}
}
module.exports=smartMoneySignal