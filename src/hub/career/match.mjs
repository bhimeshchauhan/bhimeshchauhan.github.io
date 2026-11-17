export function match(programs,{goal,budget,time,format}={}) {
  return programs.filter(p=>(!budget||(p.cost!==null&&p.cost<=budget))&&
    (!time||p.months<=time)&&(!format||p.format===format))
    .sort((a,b)=>Number(b.tags.includes(goal))-Number(a.tags.includes(goal)));
}
