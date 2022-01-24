const db = wx.cloud.database({
  env: "prod-xs44g"
})
const PHOTO = 'photo'
const PHOTOId = 'f2a60d815edb9a7e0055717f4f4c1e6b'
const NICKNAME = 'nickname'
const NICKNAMEId = '8a6c3bf65f5de37f0131c4827197662f'
function getPhoto() {  
  return db.collection(PHOTO).doc(PHOTOId).get()  
}
function getNickName() {  
  return db.collection(NICKNAME).doc(NICKNAMEId).get()  
}
export { getPhoto, getNickName }