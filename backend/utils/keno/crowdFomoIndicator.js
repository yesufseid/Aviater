function crowdFomoIndicator(data) {
  if (data > 1000) {
    return "⚠️ Everyone is betting long — expect early crash";
  }
  return "🟢 Crowd is cautious — better odds expected";
}

module.exports=crowdFomoIndicator