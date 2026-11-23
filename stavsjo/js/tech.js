/* =====================================================================
   STAVSJÖ — v9: Hot Spring Technology page, credentials, project list.
   Source: Beijing Yuanwang product manual (rev. 27 June). Bilingual
   labels (English + 中文) for every diagram and drawing taken from it.
   ===================================================================== */
(function(){
const $=s=>document.querySelector(s);
const zh=t=>`<span class="zh">${t}</span>`;

/* ---------- 1. geothermal water treatment flow ---------- */
const GEO_FLOW=[
 ["Hot spring well","温泉井","Raw geothermal water"],
 ["Hydrocyclone sand separator","旋流除砂器","Removes coarse particles · 去除大块颗粒物"],
 ["Aeration","曝气","Oxidises the spring water · 使温泉水氧化"],
 ["Iron & manganese removal","除铁锰装置","Removes excess Fe²⁺ · 去除水中过量二价铁"],
 ["Activated carbon filter","活性炭过滤","Clarifies, removes colour & odour · 澄清水质，脱色脱味"],
 ["Storage tank + plate heat exchanger","水箱 + 板换","Buffer storage and temperature control"],
 ["Supply pump","水泵","To the pools"],
 ["Hot spring pools","温泉泡池","With their own pool water treatment · 泡池水处理系统"]
];
const RAW=[
 ["Hydrogen sulphide","硫化氢","Aeration + activated-carbon adsorption","曝气法 + 活性炭吸附法"],
 ["Iron & manganese","铁、锰","Iron-removal filter with manganese-sand media","除铁过滤器（滤料采用锰砂）"],
 ["Fluoride","氟","Defluoridation vessel with activated alumina, regenerated with aluminium sulphate or sodium hydroxide","除氟罐（活性氧化铝），失效后用硫酸铝或氢氧化钠再生"],
 ["Arsenic","砷","Coagulation plus high-efficiency DeAs media — reduces ≤ 0.5 mg/L to 0.01 mg/L","混凝法 + 高效除砷滤料 DeAs，≤0.5 mg/L 降至 0.01 mg/L"],
 ["Radioactive elements","放射性元素","Flocculation and settling combined with adsorption","絮凝沉淀与吸附相结合"]
];
const MINERAL=[
 ["Carbon dioxide","二氧化碳","250","1,000","Carbonated water","碳酸水"],
 ["Total hydrogen sulphide","总硫化氢","1","2","Hydrogen-sulphide water","硫化氢水"],
 ["Fluoride","氟","1","2","Fluoride water","氟水"],
 ["Bromine","溴","5","25","Bromine water","溴水"],
 ["Iodine","碘","1","5","Iodine water","碘水"],
 ["Strontium","锶","10","10","Strontium water","锶水"],
 ["Lithium","锂","1","5","Lithium water","锂水"],
 ["Iron","铁","10","10","Iron water","铁水"],
 ["Barium","钡","5","5","Barium water","钡水"],
 ["Manganese","锰","1","—","—",""],
 ["Metaboric acid","偏硼酸","1.2","50","Boron water","硼水"],
 ["Metasilicic acid","偏硅酸","25","50","Silica water","硅水"],
 ["Metaarsenic acid","偏砷酸","1","1","Arsenic water","砷水"],
 ["Metaphosphoric acid","偏磷酸","5","—","—",""],
 ["Radon (Bq/L)","氡","37","129.5","Radon water","氡水"]
];
const LOOP=[["Pool","水池","Hot spring pool"],["Hair & lint strainer","毛发过滤器","Catches hair before the pump"],["Circulation pump","水泵","Keeps the pool water turning over"],["Sand filter","砂缸","Removes suspended matter"],["Plate heat exchanger","板换","Holds the pool at constant temperature"],["Disinfection","消毒","Chlorine, ozone or UV"]];
const EQUIP=[
 ["Circulation pumps","水泵","Polypropylene thermoplastic pump bodies; provide the flow for filtration and heating."],
 ["Sand filters","过滤砂缸","Top-mount, side-mount and commercial flanged vessels. High filtration accuracy, stable outlet quality, even distribution with no short-circuiting; simple to run, low running cost."],
 ["Plate heat exchangers","板式换热器","High heat-transfer efficiency, compact and easy to clean; plates can be added or re-arranged. Working pressure ≤ 2 MPa, temperature ≤ 200 °C. For first heat-up and daily temperature holding."],
 ["Chlorine disinfection","氯消毒","Tablets or liquid chlorine. Residual chlorine keeps working, low cost, simple — dosing must be controlled."],
 ["Ozone disinfection","臭氧消毒","Strong sterilising and oxidising power. Ozone room is ventilated: room air must stay below 0.1 mg/L."],
 ["UV disinfection","紫外线消毒","99–99.9% kill rate in 1–2 seconds; small footprint and low investment."],
 ["Balance tank","均衡水箱","Keeps the water level stable and supplies make-up water."],
 ["Water-quality monitoring","自动水质监控","Online pH, ORP, free chlorine, turbidity and temperature with automatic dosing, alarms, two-level passwords and remote data access."]
];

/* ---------- 2. cascade use ---------- */
const CASCADE=[
 {t:"80–60 °C",l:"High-temperature uses",z:"高温用热区域",items:[["Drives the liquid-desiccant dehumidifier","溶液除湿机组热驱动除湿"],["Heats bathing pools","高温用水（泡池）加热"],["Heats domestic hot water","生活热水加热"]]},
 {t:"≤ 60 °C",l:"Medium-temperature uses",z:"中低温用热区域",items:[["Water-play & pool make-up and heating","戏水泳池区补水加热、维温"],["Low-temperature pool make-up","低温区补水加热、维温"],["Floor heating and air-conditioning","地板、空调供暖"]]},
 {t:"40–20 °C",l:"Low-temperature uses",z:"低温用热区域",items:[["Water-source heat pumps extract the remaining heat","水源热泵取热"],["Floor heating and air-conditioning","地板、空调供暖"]]},
 {t:"≤ 20 °C",l:"Reinjection",z:"回灌井",items:[["Returned to the aquifer through a reinjection well","回灌井"]]}
];
const DRAWINGS=[
 {img:"tech/cascade-principle",t:"Cascade system — principle diagram",z:"梯级利用系统原理图",legend:[["潜水泵","Submersible pump"],["除砂器","Sand separator"],["汽水分离器","Steam–water separator"],["回灌加压泵","Reinjection booster pump"],["换热器 1–4","Heat exchangers 1–4"],["曝气装置","Aeration unit"],["除铁装置 / 除铁泵","Iron-removal unit / pump"],["反冲泵","Backwash pump"],["热水供水箱 / 供水泵","Hot-water tank / supply pump"],["热水回水","Hot-water return"],["系统循环泵","System circulation pump"],["中间泵","Intermediate pump"],["水源热泵","Water-source heat pump"],["末端用户","End users"]]},
 {img:"tech/cascade-schematic",t:"Ground-source heat pump — one system, two terminals",z:"梯级利用系统示意图",legend:[["自来水","Mains water"],["生活用水 65 °C","Domestic hot water 65 °C"],["储水罐","Storage tank"],["地源热泵机组","Ground-source heat pump unit"],["空调末端","Air-conditioning terminals (fan coils)"],["地板采暖","Floor heating"],["地埋管换热系统","Ground-loop heat exchanger"],["一套系统，两种末端","One system, two kinds of terminal"],["冬季地板辐射供热，夏季风盘","Floor heating in winter, fan coils in summer"]]},
 {img:"tech/wshp",t:"Water-source heat pump system",z:"水源热泵系统示意图",legend:[["能量采集系统","Energy collection — supply well, reinjection well, submersible pump, sand separator"],["能量提升系统","Energy upgrade — evaporator, compressor, condenser, expansion valve"],["制冷：阀门A开，B关","Cooling: valves A open, B closed"],["制热：阀门A关，B开","Heating: valves A closed, B open"],["能量释放系统","Energy delivery — fan coils, radiators, floor heating, showers, taps, baths"]]}
];

/* ---------- 3. dehumidification ---------- */
const DEHUM_CMP=[
 ["System","系统构成","Chiller, cooling & chilled water, steam boiler, air-handling unit, exhaust fans","Air-cooled heat pump, chilled water, air-handling unit, exhaust fans","Liquid-desiccant AHU with built-in heat pump"],
 ["Zone control","分区控制","Not possible","Not possible","Possible"],
 ["Summer dehumidification","夏季除湿方式","Condensing","Condensing","Liquid desiccant"],
 ["Summer reheat","夏季再热量","High","High","Low"],
 ["Winter humidification","冬季加湿方式","Electric / steam","Electric / steam","By the solution"],
 ["Total heat recovery","全热回收装置","None","None","Solution-based total heat recovery"],
 ["Running energy","运行能耗","Higher","Highest","Low"]
];

/* ---------- 4. light & shadow spa ---------- */
const STORM=[["84 m²","Pool area","泡池面积"],["4 + 10","Super-jet + hydromassage positions","超级喷射 + 水疗按摩体位"],["44.8 m²","Rain area","降雨面积"],["75 m²","LED wall · 37.5 × 2 m","LED 面积"]];
const STORM_SPEC=[["Hydrotherapy","超级喷射水疗","4 super-jet and 10 hydromassage positions"],["LED walls","LED 屏","Four walls, P2.5 LED, refresh > 3,840 Hz, 2.5 m high"],["Wind & rain","风雨系统","8 wind units; rain modules, pipework, 304 stainless rain heads, pumps; lightning"],["Control","控制系统","Hardware synchronised to the film timeline in one integrated controller"],["Film","片源","Storm scene, 4K, about 4 minutes"],["Other","其他","Waterproof speakers, cabling and pipework"]];
const LED=[["Module size","模组尺寸","320 × 160 mm"],["Pixel pitch","点间距","2.5 mm · 1R1G1B · 128 × 64 px"],["Brightness","亮度","≥ 450 cd/m²"],["Refresh rate","刷新频率","≥ 3,840 Hz"],["Lifetime","使用寿命","100,000 h (to 50% brightness)"],["Viewing angle","可视角度","H 140 ± 10° · V 130 ± 10°"],["Power","工作电压","110–240 V, 50/60 Hz"],["Environment","工作环境","−20 to +40 °C · 10–65% RH, non-condensing"],["Viewing distance","推荐观看距离","2.5 m minimum"],["Control distance","控制距离","100 m over Cat 5e · 10 km over single-mode fibre"]];

/* ---------- 5. smart management ---------- */
const LAYERS=[
 ["Publishing","数据发布","Control-centre display wall"],
 ["Processing & application","数据处理 / 应用层","System workstation · server · mobile remote monitoring"],
 ["Transmission","数据传输层","Network switch · internet"],
 ["Acquisition & control","数据采集 / 控制层","DCS data-acquisition modules · equipment control cabinets"]
];
const SENSE=[["Environment","环境监测"],["Energy metering","能源计量"],["Temperature · pressure · level","温度 / 压力 / 液位检测"],["Water quality","水质检测"],["Ozone","臭氧检测"],["Plant-room flooding","机房积水"],["Visitor counting","人流量监测"]];
const ACT=[["Pressurised spring-water supply","温泉加压供水"],["Geothermal heat use","地热水利用"],["Pool water treatment","温泉池水处理"],["Pool fill & drain","温泉池注水 / 排水"],["Plant-room ventilation & drainage","机房排风 / 排水"],["Temperature displays & guidance","温度显示 / 智能引导"]];
const SUBSYS=[
 ["Cascade use & dehumidification","地热梯级利用与除湿系统",["Level, temperature and pressure transmitters on tanks and pipes","Spring-water supply pumps, circulation pumps and water-source heat pumps","PI control valves on the heat-exchanger heating water; motorised two- and three-way valves"]],
 ["Indoor pool","泡池水处理 — 室内温泉区游泳池",["Level transmitter on balance tank and pool; return-water temperature","Online turbidity (NTU) meter; ozone generator; coagulant dosing pump","Water-temperature display at the information sign; step lighting"]],
 ["Outdoor flow-through pools","室外温泉区直流直排泡池",["PI valve on the spring-water supply; pool temperature and level","Motorised drain valve, step lighting","Outdoor valve-control box"]],
 ["Guest-room courtyard pools","客房庭院温泉泡池",["Linked to the hotel PMS at check-in and check-out","Electromagnetic flowmeter on each supply","Touch screen for fill, drain, temperature and top-up"]],
 ["Sauna rooms","汗蒸房温度管理系统",["Room temperature management","Heater and lighting control from the central system"]],
 ["Energy management","地热利用能源管理系统",["Smart electricity meters, smart water meters (spring and mains), BTU heat meters","Reports by year, month, day or hour; energy-cost analysis","Charts and curves for managers; remote monitoring"]]
];

/* ---------- credentials ---------- */
const PATENTS=[["Functional hot spring pool","一种功能型温泉泡池"],["Panoramic hot spring pool","全景式温泉泡池"],["Energy-saving hot spring pool","一种节能温泉泡池"],["Defluoridation water-treatment equipment","除氟水处理设备"],["Iron & manganese removal device","除铁锰水处理装置"],["Water-pressure massage head and massage shower system","水压按摩头及按摩淋浴系统"],["Pipe anti-freeze system","一种水管防冻系统"],["Heat-recovery system","热能回收系统"],["Multi-dimensional heating system","多维加热系统"],["Sweat-steam room system","汗蒸房系统"]];
const PAT_IMG=["pat-39","pat-40","pat-41","pat-42","pat-43","pat-44","pat-45","pat-46","pat-47","pat-48","pat-49"];
const QUALS=[["q-32","Environmental art design — Grade A","环境艺术设计甲级","China Construction Culture and Art Association · 2017"],["q-29","Construction enterprise qualification — MEP installation","建筑业企业资质证书（机电安装）","Beijing Yuanwang Liye M&E Equipment Co., Ltd."]];
const HONOURS=[["h-35","Excellent Engineering Project 2021 — national geothermal & hot spring industry","2021年度全国地热与温泉行业优秀工程项目","For the Jinyu Badaling Hot Spring Resort energy centre (Winter Olympics officials' reception centre)"],["h-33","Strategic partner","战略合作单位","China Geothermal & Hot Spring Industry Technology Alliance · Hebei Geothermal Industry Association · 2019"],["h-34","Top-10 influential brand in water-culture design & construction","中国水文化设计施工最具影响力十佳知名品牌企业","China Enterprise Credit Forum · 2016"],["h-36","Top-10 figures leading the hot spring leisure industry 2016 — Chen Lian, General Manager","引领温泉休闲行业 · 2016十大魅力人物 — 陈联 总经理","China Enterprise Credit Forum · 2016"]];

/* ---------- full project list (from the manual) ----------
   cat: g geothermal & energy · s hot spring spa & resort · p pool & water park · w water features */
const PLIST=[
 ["Jinyu Badaling Hot Spring Hotel","金隅八达岭温泉酒店","Yanqing, Beijing","2022 Winter Olympics hotel — heating, air-conditioning, dehumidification, water treatment, cascade use","g"],
 ["Ruilinwan Hot Spring Hotel","瑞麟湾温泉酒店","Beijing","Integrated geothermal system","g"],
 ["Rongtai Jianguo Hot Spring Hotel","榕泰建国温泉酒店","Tianjin","Geothermal application","g"],
 ["Aosen Hot Spring Hotel","澳森温泉酒店","Shijiazhuang, Hebei","Heating, air-conditioning, hot spring water treatment","g"],
 ["Xiong'an International Hotel","雄安国际大酒店","Xiong'an, Hebei","Geothermal application","g"],
 ["Boxin Hot Spring Hotel","泊心温泉酒店","Huailai, Hebei","Integrated geothermal system","g"],
 ["Longevity Village Hot Spring Centre","长寿村温泉中心","Yanggu, Shandong","Heating, air-conditioning, water treatment","g"],
 ["Jinan Steel Hot Spring Hotel","济南钢铁温泉酒店","Jinan, Shandong","Geothermal system","g"],
 ["Qingliangwan Hot Spring Town","清凉湾温泉小镇","Xinzhou, Shanxi","Geothermal application","g"],
 ["Huangjin Shijia Hot Spring Town","黄金世家温泉小镇","Datong, Shanxi","Integrated geothermal energy","g"],
 ["Sunshine Fenhe Bay Hot Spring Hotel","阳光汾河湾温泉酒店","Taiyuan, Shanxi","Heating, air-conditioning, dehumidification, water treatment","g"],
 ["Shuimi Basha Hot Spring Water City","水蜜芭莎温泉水城","Shanxi","Heating, air-conditioning, water treatment","g"],
 ["Jingchuan Hot Spring Hotel","泾川温泉酒店","Jingchuan, Gansu","Heating, air-conditioning, water treatment","g"],
 ["Ruige Hot Spring Hotel, Tang Town","唐镇瑞格温泉酒店","Shaanxi","Cascade use of geothermal water","g"],
 ["China Coal geothermal test base","中煤地热试验基地","Qinghai","Feasibility study","g"],
 ["Hada Volcano Geothermal Hot Spring","哈达火山地热温泉","Ulanqab, Inner Mongolia","Geothermal hot spring","g"],
 ["Mujiale Hot Spring Camp","牧家乐温泉营地","Lhasa, Tibet","Hot spring camp","s"],
 ["Mengkete Hot Spring Camp","孟克特温泉营地","Xinjiang","Hot spring camp","s"],
 ["Yuquanwan Hot Spring Hotel","御泉湾温泉酒店","Qapqal, Xinjiang","Hot spring hotel","s"],
 ["Hailuogou geothermal hot spring","海螺沟地热温泉","Sichuan","Geothermal hot spring system","g"],
 ["Changshou Lake CPVC camp","长寿湖 CPVC 营地","Chongqing","Camp water systems","s"],
 ["Twelve Hot Springs Hotel","十二温泉酒店","Mangshi, Yunnan","Geothermal application","g"],
 ["Meilin geothermal water","美林地热水除砷","Lijiang, Yunnan","Arsenic removal from geothermal water","g"],
 ["Baili Dujuan geothermal","百里杜鹃地热应用","Guizhou","Geothermal application","g"],
 ["Liuguang Hot Spring","六广温泉","Guizhou","Integrated use system","g"],
 ["STAVSJÖ Hotel","瑞典 STAVSJÖ 酒店","Nyköping, Sweden","Shallow ground-source heat pump heating","g"],
 ["Suman Hot Spring Club","苏曼温泉会馆","Fujian","Hot spring spa","s"],
 ["Moon River Hot Spring SPA Club","月亮河温泉SPA会馆","Beijing","Water treatment","s"],
 ["UN e-commerce centre Olympic pool","联合国电子商务中心奥林匹克游泳池","Beijing","Pool water treatment","p"],
 ["Happy Base Camp water playground","欢乐大本营戏水乐园","Beijing","Renovation","p"],
 ["Tianshan Sea World water park","天山海世界水上乐园","Hebei","Renovation","p"],
 ["Taihe Bathing Plaza","太和洗浴广场","Shenyang","Landscape water features","w"],
 ["Xindingfu Hotel","鑫鼎富大酒店","Beijing","Landscape water features","w"],
 ["Huashilong International Apartments","华世隆国际公寓","Beijing","Landscape water features","w"],
 ["Beichen Resort","北辰度假村","Qinhuangdao, Hebei","Landscape water features","w"],
 ["Gemdale International Garden","金地国际花园","Beijing","Water features","w"],
 ["Guoyitang herbal bath","国医堂香炉药浴","Beijing","Water treatment","s"],
 ["Sandu Yunze Villa pool","三渡云泽山庄游泳池","Fangshan, Beijing","Pool water treatment","p"],
 ["Honghao Holiday Hotel","宏昊假日酒店标准游泳馆","Zhangjiakou, Hebei","Standard natatorium water treatment","p"],
 ["Guoda Yu Hot Spring Holiday Hotel","国大御温泉假日酒店","Shijiazhuang, Hebei","Outdoor hot spring spa and pool","s"],
 ["China Mobile Management Academy","中国移动管理学院","Beijing","Outdoor hot spring spa and VIP villas","s"],
 ["Chilechuan hot springs","刺勒川温泉","Inner Mongolia","Indoor and outdoor spa, bathhouse villas","s"],
 ["Guoxin Hot Spring Hotel","国信温泉酒店","Changchun, Jilin","Indoor and outdoor spa, bathhouse villas","s"],
 ["Guiliu Xianzhuang","桂柳仙庄","Baoding, Hebei","Indoor and outdoor spa, bathhouse villas","s"],
 ["Zhongfang Yintang","中房银汤","Dandong, Liaoning","Indoor and outdoor spa, bathhouse villas","s"],
 ["Wantong hot spring","万通温泉","Ordos, Inner Mongolia","Geothermal water treatment","g"],
 ["China Club","中国会馆","Beijing","Geothermal water treatment","g"],
 ["Heiyu Lake","黑鱼湖","Daqing, Heilongjiang","Geothermal water treatment","g"],
 ["Sunshine Holiday Hotel","阳光假日酒店","Beijing","Indoor and outdoor spa, bathhouse villas","s"],
 ["Gubei Water Town (Simatai)","司马台古北水镇","Miyun, Beijing","Indoor and outdoor spa, bathhouses, water treatment","s"],
 ["Jiuhua Resort International Health Club","九华山庄国际保健俱乐部","Beijing","Integrated hot spring water system","s"],
 ["World Hot Spring Tribe, American County clubhouse","世界温泉部落美国郡会所","Shenyang, Liaoning","Hot spring water treatment","s"],
 ["Qixing Jiulongwan Hot Spring Hotel","七星九龙湾温泉大酒店","Shenyang, Liaoning","Hot spring water treatment","s"],
 ["Taohuayuan Hot Spring Hotel","桃花源温泉酒店","Shenyang, Liaoning","Geothermal application","g"],
 ["Beiguo Zhichun Hot Spring World","北国之春温泉大世界","Dandong, Liaoning","Integrated geothermal system","g"],
 ["Qingjian Xianggen Hot Spring Club","青建香根温泉会所","Qingdao, Shandong","Hot spring water treatment","s"],
 ["Zhongfang Hot Spring Hotel","中房温泉酒店","Dandong, Liaoning","Geothermal system","g"],
 ["Wanggong Hot Spring City","王宫温泉城","Liaoyang, Liaoning","Geothermal application","g"],
 ["Shengtai Celebrity Business Hotel","盛泰名人商务酒店","Cangzhou, Hebei","Water treatment","s"],
 ["Honglu Hot Spring Resort","红栌温泉山庄","Beijing","Heating, air-conditioning, dehumidification, water treatment","g"],
 ["Arcadia Hot Spring Resort Hotel","阿尔卡迪亚温泉度假酒店","Liaocheng, Shandong","Hot spring water treatment","s"],
 ["Shandong Gold International Hot Spring Club","山东黄金国际温泉会所","Shandong","Heating, air-conditioning, water treatment","g"],
 ["Sun City Hot Spring Water World","太阳城温泉阳光水世界","Beijing","Water treatment","p"],
 ["Nangong Hot Spring Water World","南宫温泉水世界","Beijing","Heating, air-conditioning, dehumidification, water treatment","p"],
 ["Shengshiyuan Hot Spring Hotel water playground","圣世苑温泉大酒店戏水乐园","Yanqing, Beijing","Water treatment","p"],
 ["Jinruiyuan Hot Spring Resort","金瑞园温泉度假村","Guilin, Guangxi","Hot spring camp","s"],
 ["Noah's Ark Hot Spring Club","诺亚方舟温泉俱乐部","Henan","Heating, air-conditioning, dehumidification, water treatment","g"],
 ["Nangong Hot Spring Hotel","南宫温泉大酒店","Beijing","Indoor and outdoor hot spring spa","s"],
 ["Palm Beach hot spring villas","棕榈滩温泉别墅区","Beijing","Water treatment","s"],
 ["Xinghuyuan Resort Hotel natatorium","星湖园度假酒店游泳馆","Beijing","Pool water treatment","p"],
 ["Shanxi Oriental Hotel","山西东方大酒店","Shanxi","Heating, air-conditioning, dehumidification, water treatment","g"],
 ["Daqian World Hot Spring City","大千世界温泉城","Hebei","Heating, air-conditioning, dehumidification, water treatment","g"],
 ["Longhe Hot Spring International Club","隆鹤温泉国际会馆","Beijing","Water treatment","s"]
];
const PCAT={g:"Geothermal & energy",s:"Hot spring & spa",p:"Pools & water parks",w:"Water features"};
window.STAVSJO_PLIST=PLIST;

/* ---------- render: technology page ---------- */
function fig(img,cap,capzh,legend){return `<figure class="tdraw" data-zoom data-src="img/${img}.jpg" data-cap="${cap} · ${capzh}"><div class="im"><img src="img/${img}.jpg" alt="${cap}" loading="lazy"></div><figcaption><b>${cap}</b>${zh(capzh)}${legend?`<dl class="legend">${legend.map(l=>`<div><dt>${l[0]}</dt><dd>${l[1]}</dd></div>`).join('')}</dl>`:''}</figcaption></figure>`}
function renderTech(){
  $('#geoFlow').innerHTML=GEO_FLOW.map((s,i)=>`<li><i>${String(i+1).padStart(2,'0')}</i><b>${s[0]}</b>${zh(s[1])}<span>${s[2]}</span></li>`).join('');
  $('#rawTbl').innerHTML=`<tr><th>Substance · 成分</th><th>Treatment method · 处理方法</th></tr>`+RAW.map(r=>`<tr><td>${r[0]}${zh(r[1])}</td><td>${r[2]}${zh(r[3])}</td></tr>`).join('');
  $('#minTbl').innerHTML=`<tr><th>Component · 成分</th><th>Medically valuable · 有医疗价值浓度</th><th>Named mineral water · 命名矿水浓度</th><th>Water type · 矿水名称</th></tr>`+MINERAL.map(r=>`<tr><td>${r[0]}${zh(r[1])}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}${r[5]?zh(r[5]):''}</td></tr>`).join('');
  $('#loop').innerHTML=LOOP.map((s,i)=>`<li style="--i:${i}"><i>${i+1}</i><b>${s[0]}</b>${zh(s[1])}<span>${s[2]}</span></li>`).join('');
  $('#equip').innerHTML=EQUIP.map(e=>`<div class="box"><h3>${e[0]}</h3>${zh(e[1])}<p>${e[2]}</p></div>`).join('');
  $('#plantGal').innerHTML=[1,2,3,4,5,6].map(n=>`<figure data-zoom data-src="img/tech/plant-${n}.jpg" data-cap="Water treatment plant room under construction · 水处理机房施工实景"><div class="im"><img src="img/tech/plant-${n}.jpg" alt="Plant room under construction" loading="lazy"></div></figure>`).join('');
  $('#cascade').innerHTML=CASCADE.map(c=>`<div class="cstep"><div class="ct">${c.t}</div><b>${c.l}</b>${zh(c.z)}<ul>${c.items.map(i=>`<li>${i[0]}${zh(i[1])}</li>`).join('')}</ul></div>`).join('');
  $('#drawings').innerHTML=DRAWINGS.map(d=>fig(d.img,d.t,d.z,d.legend)).join('');
  $('#dehumTbl').innerHTML=`<tr><th></th><th>Water-cooled conventional<span class="zh">水冷式传统空调</span></th><th>Air-cooled conventional<span class="zh">风冷式传统空调</span></th><th class="us">Liquid-desiccant system<span class="zh">溶液空调系统</span></th></tr>`+DEHUM_CMP.map(r=>`<tr><td>${r[0]}${zh(r[1])}</td><td>${r[2]}</td><td>${r[3]}</td><td class="us">${r[4]}</td></tr>`).join('');
  $('#dehumFigs').innerHTML=fig('tech/sd-principle','Geothermal-driven liquid-desiccant dehumidification','地热驱动溶液除湿 · 系统工作原理图',[["送风 / 回风","Supply air / return air"],["排风机 · 排风","Exhaust fan · exhaust air"],["新风","Fresh air"],["预冷型溶液全空气机组","Pre-cooled liquid-desiccant all-air unit"],["空调冷水 5–13 °C","Chilled water 5–13 °C"],["地热热水 60–50 °C","Geothermal hot water 60–50 °C"]])+fig('tech/sd-chart','Dehumidification paths compared','与其它除湿方式比较',[["冷冻除湿","Condensing"],["溶液除湿","Liquid desiccant"],["转轮除湿","Desiccant wheel"],["室外空气点 → 送风点","Outdoor air → supply air"],["温度 / 含湿量","Temperature / moisture content"]])+fig('tech/sd-unit','Geothermal-driven liquid-desiccant all-air unit','地热驱动式溶液全空气机组',[["再生单元","Regeneration section"],["除湿单元","Dehumidifying section"],["溶液槽","Solution tank"],["压缩机","Compressor"],["高温高湿排风","Hot, humid exhaust"],["干燥新风","Dried fresh air"]]);
  $('#stormFacts').innerHTML=STORM.map(s=>`<div><b>${s[0]}</b><span>${s[1]}</span>${zh(s[2])}</div>`).join('');
  $('#stormSpec').innerHTML=STORM_SPEC.map(s=>`<tr><th>${s[0]}${zh(s[1])}</th><td>${s[2]}</td></tr>`).join('');
  $('#ledSpec').innerHTML=LED.map(s=>`<tr><th>${s[0]}${zh(s[1])}</th><td>${s[2]}</td></tr>`).join('');
  $('#stormFigs').innerHTML=fig('tech/storm','Storm scene — four-wall LED room','光影水疗空间 · 暴风骤雨')+fig('tech/volcano','Volcano scene with wave jets','回游风吕 · 虚实结合的海浪和浪花')+fig('tech/storm-plan','Pool plan — 84 m², 4 super-jets, 10 massage positions','光影温泉泡池平面')+fig('tech/storm-ceiling','Ceiling plan — rain modules over the pool','光影温泉天花平面')+fig('tech/rain-module','Vertical rain module — 800 × 800 mm, 304 stainless, 25 kg','垂直降雨模块 · 降雨装置 / 实景');
  $('#layers').innerHTML=LAYERS.map((l,i)=>`<div class="layer"><i>L${4-i}</i><div><b>${l[0]}</b>${zh(l[1])}</div><span>${l[2]}</span></div>`).join('');
  $('#sense').innerHTML=SENSE.map(s=>`<li>${s[0]}${zh(s[1])}</li>`).join('');
  $('#act').innerHTML=ACT.map(s=>`<li>${s[0]}${zh(s[1])}</li>`).join('');
  $('#subsys').innerHTML=SUBSYS.map((s,i)=>`<div class="box"><span class="n">${String(i+1).padStart(2,'0')}</span><h3>${s[0]}</h3>${zh(s[1])}<ul>${s[2].map(x=>`<li>${x}</li>`).join('')}</ul></div>`).join('');
}
/* ---------- render: credentials (Quality page) ---------- */
function renderCreds(){
  $('#patList').innerHTML=PATENTS.map(p=>`<li>${p[0]}${zh(p[1])}</li>`).join('');
  $('#patGal').innerHTML=PAT_IMG.map(p=>`<figure data-zoom data-src="img/cert/${p}.jpg" data-cap="Utility-model patent certificate · 实用新型专利证书"><div class="im"><img src="img/cert/${p}.jpg" alt="Utility-model patent certificate" loading="lazy"></div></figure>`).join('');
  const card=(q)=>`<figure class="credc" data-zoom data-src="img/cert/${q[0]}.jpg" data-cap="${q[1]} · ${q[2]}"><div class="im"><img src="img/cert/${q[0]}.jpg" alt="${q[1]}" loading="lazy"></div><figcaption><b>${q[1]}</b>${zh(q[2])}<span>${q[3]}</span></figcaption></figure>`;
  $('#quals').innerHTML=QUALS.map(card).join('');
  $('#honours').innerHTML=HONOURS.map(card).join('');
}
/* ---------- render: full project list (Projects page) ---------- */
function renderPList(){
  const box=$('#plist');if(!box)return;let cat='all',q='';
  const draw=()=>{const rows=PLIST.filter(p=>(cat==='all'||p[4]===cat)&&(!q||(p.join(' ').toLowerCase().includes(q))));
    box.innerHTML=rows.map(p=>`<div class="prow"><b>${p[0]}</b>${zh(p[1])}<span class="pl">${p[2]}</span><span class="ps">${p[3]}</span><span class="pc c-${p[4]}">${PCAT[p[4]]}</span></div>`).join('')||'<p class="note">No match.</p>';
    $('#plCount').textContent=rows.length+' of '+PLIST.length+' projects'};
  $('#plFilter').innerHTML=`<button class="on" data-c="all">All</button>`+Object.entries(PCAT).map(([k,v])=>`<button data-c="${k}">${v}</button>`).join('');
  $('#plFilter').onclick=e=>{const b=e.target.closest('button');if(!b)return;cat=b.dataset.c;[...$('#plFilter').children].forEach(x=>x.classList.toggle('on',x===b));draw()};
  $('#plSearch').oninput=e=>{q=e.target.value.trim().toLowerCase();draw()};
  draw();
}
window.STAVSJO_TECH={renderTech,renderCreds,renderPList};
})();
