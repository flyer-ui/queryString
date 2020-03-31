/** 
 * QueryString
 * 用于处理URL参数
 */

//请求参数
interface IParameter{
  value: string
  name: string
}

//开放的API
interface IQueryString{

  append: (name: string,value: string,encode?: boolean) => void

  delete: (name: string) => void

  get: (name: string) => IParameter

  getAll: () => Array<IParameter>

  set: (params: Array<IParameter>,encode?: boolean) => void

  has: (name: string) => boolean

  generateURLParameters: (url: string) => string
}

function QueryString (): IQueryString{
  const params = {}

  function replace (value: string,target: string,regExpress: RegExp,lenght?: number){
    return target.replace(target.substring(target.search(regExpress),lenght?lenght:target.length),value)
  }

  function getHashValue (target: string){
    return target.substring(target.search(/#/))
  }

  function combloxURL (strParams: string,url: string){
    const hashValue: string = getHashValue(url)
    strParams = replace('',strParams,/^&/,1)
    url = replace('',url,/#/)
    return `${replace(`?${strParams}`,url,/\?/)}${hashValue}`
  }

  return {
    //追加一个完整参数
    append: function (name: string,value: string,encode=false){
      encode?params[name]=encodeURIComponent(value):params[name]=value
    },

    //删除一个完整参数
    delete: function (name: string){
      delete params[name]
    },

    //通过名称得到对应的值
    get: function (name: string){
      return params[name]
    },

    //得到所有的参数
    getAll:function (){
      const aryParams: Array<IParameter> = []
      Object.keys(params).forEach(name=>{
        aryParams.push({name:name,value:params[name]})
      })
      return aryParams
    },

    //设置一个完整的参数集
    set:function (params: Array<IParameter>,encode = false){
      params.forEach(param=>{
        this.append(param.name,param.value,encode)
      })
    },

    //判断是否存在指定的name值
    has:function (name: string){
      return !params[name]
    },

    //传入一个指定的URL，并将参数集按URL参数格式追加在这个URL上。
    generateURLParameters:function (url: string){
      const aryParams: Array<IParameter> = this.getAll()
      let strParams = ''
      aryParams.forEach(param=>{
        strParams+=`&${param.name}=${param.value}`
      })
      return combloxURL(strParams,url)
    }
  }
}

QueryString.version = '0.0.1'

export default QueryString