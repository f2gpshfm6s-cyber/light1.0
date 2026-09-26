const SAVE_KEY="last_lamp_v10";
const MAX_DAYS=30;

const initial={
 day:1, people:1200, energy:70, food:75, military:35, morale:60,
 clues:0, truth:0, technology:0, refugees:0,
 flags:{crystal:false,signal:false,traveler:false,tower:false,route:false,launch:false,truth:false},
 log:[]
};
let s=load()||structuredClone(initial);

const events=[
 {title:"北方的三聲鐘",text:"入夜後，北方遺跡傳來三聲鐘響。守衛說那座遺跡已荒廢數十年。",choices:[
  ["派20名守衛調查",()=>{s.energy-=4;s.military-=3;s.clues+=1;s.flags.crystal=true;return"守衛找到一枚仍然溫熱的黑色晶體。它與發電塔的能量頻率相似。";}],
  ["封鎖北方道路",()=>{s.military+=3;s.morale-=2;return"道路被封鎖了。鐘聲卻在午夜再次響起。";}],
  ["暫時忽略",()=>{s.morale+=1;return"你把注意力放在城市內部。某些事情因此錯過了。";}]
 ]},
 {title:"糧倉起火",text:"城南糧倉冒出濃煙。火勢尚未蔓延，但裡面存著全城兩週的糧食。",choices:[
  ["全力救火",()=>{s.energy-=6;s.food+=5;s.military+=1;return"糧倉保住大半，但發電站今晚必須限電。";}],
  ["優先搶救糧食",()=>{s.food+=10;s.morale-=3;return"糧食救回不少，但幾棟民宅被火星波及。";}],
  ["放棄糧倉，保護居民",()=>{s.people-=15;s.morale+=4;s.food-=8;return"居民安全撤離，但糧倉幾乎化為灰燼。";}]
 ]},
 {title:"陌生人抵達城門",text:"一群疲憊的旅人來到城門。他們聲稱知道太陽熄滅的原因，但需要食物與庇護。",choices:[
  ["收留他們",()=>{s.people+=45;s.food-=12;s.morale+=5;s.refugees+=45;s.flags.traveler=true;s.clues+=1;return"旅人進城。一名老人告訴你：『你們看見的不是日落，是遮蔽。』";}],
  ["只提供食物",()=>{s.food-=7;s.clues+=1;return"旅人離開前留下了一句話：『真正的黑夜還沒開始。』";}],
  ["拒絕入城",()=>{s.morale-=5;s.military+=2;return"城門重新關上。遠處的旅人沒有回頭。";}]
 ]},
 {title:"發電塔異常",text:"中央發電塔突然自行啟動。儀表顯示能源消耗異常，但城市照明反而變得更穩定。",choices:[
  ["讓它繼續運轉",()=>{s.energy+=12;s.morale+=3;s.technology+=2;s.flags.signal=true;s.flags.tower=true;return"能源增加了。塔頂卻傳來人耳難以察覺的低鳴。";}],
  ["立刻關閉",()=>{s.energy-=3;s.military+=2;return"發電塔停止。異常現象暫時消失。";}],
  ["派技師檢查",()=>{s.energy-=5;s.technology+=4;s.flags.signal=true;s.flags.tower=true;return"技師發現：發電塔正在接收來自高空的訊號。";}]
 ]},
 {title:"地下的藍光",text:"城牆下方出現藍色裂光。工程隊認為地下可能存在舊時代的能源管線。",choices:[
  ["挖掘",()=>{s.energy-=6;s.technology+=6;s.clues+=1;s.flags.route=true;return"你找到一條通往北方山脈的地下能源管線。";}],
  ["封存",()=>{s.morale+=2;return"你封住裂口。夜裡卻有人看見藍光仍在地下流動。";}],
  ["軍方接管",()=>{s.military+=5;s.energy-=3;return"軍方建立了地下哨站，但研究進度變慢。";}]
 ]},
 {title:"老人的圖紙",text:"收留的旅人拿出一張古老圖紙。它描繪的不是武器，而是一座直指天空的巨大能源塔。",choices:[
  ["研究圖紙",()=>{s.technology+=8;s.clues+=2;return"你終於理解：黑暗似乎正在從天空之外逼近。";}],
  ["把圖紙交給軍方",()=>{s.military+=6;s.technology+=3;return"軍方開始建造防禦工事。";}],
  ["燒掉圖紙",()=>{s.morale+=2;return"你拒絕相信這種瘋狂計畫。";}]
 ]},
 {title:"最後的觀測",text:"天空出現肉眼可見的黑色圓環。城內所有鐘錶同時停了三秒。",choices:[
  ["啟動發電塔訊號",()=>{if(s.flags.tower){s.truth+=3;s.flags.truth=true;return"天空回應了。你收到一段訊息：『不要等待太陽回來。』";}s.energy-=5;return"沒有任何回應。你缺少足夠的能源共振。";}],
  ["準備撤離",()=>{s.people-=20;s.food-=8;s.flags.launch=true;s.route=true;return"你開始把人員與物資轉移到地下能源管線。";}],
  ["全城備戰",()=>{s.military+=8;s.morale+=3;return"城牆上亮起探照燈。你不知道敵人究竟在哪裡。";}]
 ]}
];

function clamp(){
 ["energy","food","military","morale"].forEach(k=>s[k]=Math.max(0,Math.min(100,s[k])));
 s.people=Math.max(0,s.people);
}
function addLog(t){s.log.unshift(`Day ${s.day}：${t}`);s.log=s.log.slice(0,12);save()}
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(s))}catch(e){}}
function load(){try{const x=localStorage.getItem(SAVE_KEY);return x?JSON.parse(x):null}catch(e){return null}}
function resetGame(){localStorage.removeItem(SAVE_KEY);s=structuredClone(initial);addLog("你接管了曙光城。太陽只剩30天。");showEvent()}
function dailyCost(){s.food-=5;s.energy-=2;if(s.food<25)s.morale-=3;if(s.energy<20)s.morale-=2}
function ending(){
 let title="",text="";
 if(s.day>MAX_DAYS){
   if(s.truth>=3 && s.flags.truth){title="☀️ 真相結局：不是日落";text="你破解了高空訊號。太陽並沒有熄滅，而是被某種巨大的遮蔽物逐步覆蓋。你啟動了最後的能源塔，讓全城看見了第一道真正的曙光。";}
   else if(s.technology>=18 && s.flags.tower){title="🚀 曙光結局：升空";text="你完成了能源塔。曙光城不再等待天空恢復，而是主動把能源送入高空，打穿黑暗。";}
   else if(s.flags.route && s.people>=900 && s.food>=20){title="🏕️ 遷徙結局：地下曙光";text="你帶著大部分居民沿著地下能源管線離開。你失去了城市，卻保存了文明。";}
   else if(s.morale>=50 && s.military>=45){title="🏰 永夜城結局";text="你沒有找到太陽的答案，但你讓城市活了下來。曙光城成為黑暗時代第一座永久燈火之城。";}
   else {title="🌑 黑夜結局";text="第三十天過去了。燈光一盞盞熄滅。你守住了一些東西，卻沒有找到足以拯救城市的方法。";}
   return {title,text};
 }
 if(s.people<=0||s.morale<=0||s.energy<=0||s.food<=0)return {title:"☠️ 曙光熄滅",text:"城市的核心資源歸零。你的旅程提前結束。"};
 return null;
}
function render(){
 for(const k of ["day","people","energy","food","military","morale"])document.getElementById(k).textContent=s[k];
 document.getElementById("log").innerHTML=s.log.map(x=>`<div>${x}</div>`).join("");
}
function showEvent(){
 const end=ending();
 if(end){document.getElementById("eventBox").innerHTML=`<h2>${end.title}</h2><p>${end.text}</p><p><b>最終天數：</b>${Math.min(s.day,MAX_DAYS)}　<b>線索：</b>${s.clues}　<b>科技：</b>${s.technology}</p>`;document.getElementById("choices").innerHTML='<button class="choice" onclick="resetGame()">重新挑戰</button>';render();return;}
 const e=events[(s.day-1)%events.length];
 document.getElementById("eventBox").innerHTML=`<h2>${e.title}</h2><p>${e.text}</p>`;
 const c=document.getElementById("choices");c.innerHTML="";
 e.choices.forEach(([label,fn])=>{const b=document.createElement("button");b.className="choice";b.textContent=label;b.onclick=()=>{
   const msg=fn();clamp();addLog(msg);dailyCost();clamp();s.day++;
   const special=ending(); if(!special){addLog("新的一天開始。");}
   save();render();showEvent();
 };c.appendChild(b)});
 render();
}
document.getElementById("reset").onclick=resetGame;
document.getElementById("cityBtn").onclick=()=>{addLog("你站在城牆上，看見城市的燈一盞盞亮起。");render()};
document.getElementById("ruinBtn").onclick=()=>{s.clues++;s.flags.crystal=true;addLog("北方遺跡：門上的刻痕似乎剛剛才被人觸碰過。");render()};
showEvent();
