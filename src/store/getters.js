const getAutoItemDesc = (state, itemName) => {
  const idx = itemName.lastIndexOf("_")
  let suf = itemName.substr(idx + 1)
  if (idx === -1) {
    suf = suf + ':'
  }
  return {
    label: state.desc.label[itemName] ?? itemName,
    name: itemName,
    type: state.desc.autoItem[suf]?.type ?? 'unknown',
  }
}

//itemsValue:{item1:1,item2:'val'},oldDesc:[{name:'item1',label:'lb',type:'doc'}]
const getItemsDescByValue = (state, itemsValue, oldDesc) => {
  if (!itemsValue) {
    return oldDesc
  }
  if ((oldDesc?.length ?? 0) !== 0) {
    return oldDesc
  }
  let itemsDesc = []
  for (const key in itemsValue ?? []) {
    const v = getAutoItemDesc(state, key)
    itemsDesc.push(v)
  }
  return itemsDesc
}

/*data is forms or tables,
ex:{
      "form1": {
        "id": 1,
        "no": "no1",
        "name": "name1"
      },
      "form2": {
        "id": 1,
        "no": "no1",
        "name": "name1"
      }
}
oldDesc:[
      {
      "name":"form1",
      "label":"表单1",
      "type":"form",
      "items":[
        {"name":"item1",label:"字段1",type:"string"}
      ]
    },
    {
      "name":"form2",
      "label":"表单3",
      "type":"form",
      "items":[]
    }
  ]*/
const getDataDescByValue = (state, data, oldDesc) => {
  if (!data) {
    return oldDesc
  }
  let dataDesc = []
  if (oldDesc) {
    dataDesc = oldDesc
  }

  for (const key in data) {
    let desc = oldDesc?.find(obj => obj.name === key)
    if (!desc) {
      desc = {
        name: key,
        label: state.desc.label[key] ?? key,
        items: []
      }
      dataDesc.push(desc)
    }
    desc.items = getItemsDescByValue(state, data[key][0], desc.items)
  }
  return dataDesc
}

const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  permission_routes: state => state.permission.routes,

  ///////////////////////doc
  getDoc: (state) => (docName) => {
    return state.doc[docName]
  },
  getDocLabel: (state) => (docName, docId) => {
    return state.doc[docName].find(obj => obj.id == docId)?.name ?? docId
  },
  vState: state => state.doc.vstate,
  dState: state => state.doc.dstate,
  ////////////////////////desc
  canModifyUI: state => state.desc.canModifyUI,
  userDesc: state => state.desc.user,
  labelDesc: state => state.desc.label,


  getPageDesc: (state) => (pageName) => {
    return state.desc.user.pages.find(obj => obj.name === pageName)
  },
  getFormsDesc: (state) => (pageName) => {
    return state.desc.user.pages.find(obj => obj.name === pageName).forms
  },
  getTablesDesc: (state) => (pageName) => {
    return state.desc.user.pages.find(obj => obj.name === pageName).tables
  },
  getItemsDesc: (state) => (pageName, formName) => {
    return state.desc.user.pages.find(obj => obj.name === pageName).forms.find(obj => obj.name === formName).items
  },

  getColsDescByValue: (state) => (colsValue) => {
    let cols = []
    for (const key in colsValue) {
      const v = getAutoItemDesc(state, key)
      cols.push(v)
    }
    return cols
  },

  getPageDescByValue: (state) => (pageName, pageValue) => {

    let pageDesc = state.user.pages?.find(obj => obj.name === pageName)
    if (!pageValue) {
      return pageDesc
    }
    if (!pageDesc) {
      pageDesc = {
        name: pageName,
        label: state.desc.label[pageName] ?? pageName,
      }
    }

    pageDesc.forms = getDataDescByValue(state, pageValue.forms, pageDesc.forms)
    pageDesc.tables = getDataDescByValue(state, pageValue.tables, pageDesc.tables)
    return pageDesc
  }

}


export default getters
