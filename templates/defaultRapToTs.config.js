module.exports = {
  // rap2 鉴权cookie
  rapKoaSidSig: '',
  // rap2 鉴权cookie
  rapKoaSiD: '',
  // 请求地址
  baseUrl: '',
  // 输出地址
  outDir: './src/services',
  // 请求体实例文件路径
  requestFilePath: '@/utils/request',
  // 是否只生成接口类型声明文件
  onlyTypeFile: true,
  // 返回体属性，有时会封装请求方法，处理统一请求返回泛文，只需返回接口文档中返回格式的某个属性
  responseAttr: '',
  // 此项为可选项，生成的文件默认是有道翻译rap2接口命名，有时可能名字过长或翻译语义混乱，故可以选择以接口 id 和 名称映射的方式自定义生成的接口名
  idCustomApiName: {}
};