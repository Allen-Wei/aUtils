//Array Example
var getData = function() {
    return [{ "Id": 2220, "month": "201607", "city": "天津", "cityLevel": "A" }, { "Id": 2221, "month": "201607", "city": "平顶山", "cityLevel": "B" }, { "Id": 2222, "month": "201607", "city": "长沙", "cityLevel": "A" }, { "Id": 2223, "month": "201607", "city": "丽水", "cityLevel": "C" }, { "Id": 2224, "month": "201607", "city": "宁波", "cityLevel": "A" }, { "Id": 2225, "month": "201607", "city": "潍坊", "cityLevel": "A" }, { "Id": 2226, "month": "201607", "city": "泉州", "cityLevel": "B" }, { "Id": 2227, "month": "201607", "city": "青岛", "cityLevel": "A" }, { "Id": 2228, "month": "201607", "city": "青岛", "cityLevel": "A" }, { "Id": 2229, "month": "201607", "city": "厦门", "cityLevel": "B" }, { "Id": 2230, "month": "201607", "city": "咸阳", "cityLevel": "C" }, { "Id": 2231, "month": "201607", "city": "玉溪", "cityLevel": "C" }, { "Id": 2232, "month": "201607", "city": "淄博", "cityLevel": "B" }, { "Id": 2233, "month": "201607", "city": "呼和浩特", "cityLevel": "B" }, { "Id": 2234, "month": "201607", "city": "临沂", "cityLevel": "B" }, { "Id": 2235, "month": "201607", "city": "昆明", "cityLevel": "A" }, { "Id": 2236, "month": "201607", "city": "青岛", "cityLevel": "A" }, { "Id": 2237, "month": "201607", "city": "眉山", "cityLevel": "C" }, { "Id": 2238, "month": "201607", "city": "宝鸡", "cityLevel": "B" }, { "Id": 2239, "month": "201607", "city": "阿克苏", "cityLevel": "C" }, { "Id": 2240, "month": "201607", "city": "重庆", "cityLevel": "A" }, { "Id": 2241, "month": "201607", "city": "济南", "cityLevel": "A" }, { "Id": 2242, "month": "201607", "city": "安阳", "cityLevel": "B" }, { "Id": 2243, "month": "201607", "city": "济宁", "cityLevel": "B" }, { "Id": 2244, "month": "201607", "city": "遵义", "cityLevel": "B" }, { "Id": 2245, "month": "201607", "city": "北京", "cityLevel": "S" }, { "Id": 2246, "month": "201607", "city": "河源", "cityLevel": "C" }, { "Id": 2247, "month": "201607", "city": "宜宾", "cityLevel": "C" }, { "Id": 2248, "month": "201607", "city": "鞍山", "cityLevel": "B" }, { "Id": 2249, "month": "201607", "city": "新乡", "cityLevel": "B" }, { "Id": 2250, "month": "201607", "city": "凯里", "cityLevel": "C" }, { "Id": 2251, "month": "201607", "city": "都匀市", "cityLevel": "C" }, { "Id": 2252, "month": "201607", "city": "商丘", "cityLevel": "B" }, { "Id": 2253, "month": "201607", "city": "佳木斯", "cityLevel": "C" }, { "Id": 2254, "month": "201607", "city": "衡水", "cityLevel": "B" }, { "Id": 2255, "month": "201607", "city": "伊犁", "cityLevel": "C" }, { "Id": 2256, "month": "201607", "city": "西安", "cityLevel": "A" }, { "Id": 2257, "month": "201607", "city": "郴州", "cityLevel": "C" }, { "Id": 2258, "month": "201607", "city": "郑州", "cityLevel": "A" }, { "Id": 2259, "month": "201607", "city": "黄石", "cityLevel": "C" }, { "Id": 2260, "month": "201607", "city": "广州", "cityLevel": "A" }, { "Id": 2261, "month": "201607", "city": "延安", "cityLevel": "C" }, { "Id": 2262, "month": "201607", "city": "平凉", "cityLevel": "C" }, { "Id": 2263, "month": "201607", "city": "广州", "cityLevel": "A" }, { "Id": 2264, "month": "201607", "city": "嘉兴", "cityLevel": "B" }, { "Id": 2265, "month": "201607", "city": "洛阳", "cityLevel": "B" }, { "Id": 2266, "month": "201607", "city": "苏州", "cityLevel": "A" }, { "Id": 2267, "month": "201607", "city": "锡林郭勒盟", "cityLevel": "C" }, { "Id": 2268, "month": "201607", "city": "楚雄", "cityLevel": "C" }, { "Id": 2269, "month": "201607", "city": "济南", "cityLevel": "A" }];
}


//Ajax Example
linq2js.async(function*() {
	console.log("正在请求1... ");
    var response1 = yield linq2js.ajax("/data.json");

    var first = response1.rows[0];
	console.log("请求1完成: ", response1);

	console.log("开始请求2...");
    var response2 = yield linq2js.ajax("/person.json?city=" + first.dealer_city);
    console.log("请求2完成: ", response2);

});
