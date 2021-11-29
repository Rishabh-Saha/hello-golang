"use strict";

const {
  _,
  downStreamApiCallerFunction,
  createBunyanLogger,
} = require("../utils");
const log = createBunyanLogger("bluedartFileUpload");

const uploadImagesToLogistics = async (data) => {
  const functionName = "logisticsImageUpload";
  if (!data.statustracking || !data.statustracking.length) {
    return { sucess: false, message: "Please send a valid input",status:400 };
  }

  const { Shipment } = data.statustracking[0];

  if (!Shipment) {
    return { sucess: false, message: "Please send a valid input",status:400 };
  }

  const { WaybillNo, RefNo, Scans } = Shipment;
  let obj = {};
  obj.WaybillNumber = WaybillNo;
  obj.ReferenceID = RefNo;
  let imageCount = 0;
  obj.imageObj = [];
  if (Scans.DeliveryDetails && Scans.DeliveryDetails.IDImage) {
    let imageObj = {
      imagekey: `IDImage`,
      imageValue: Scans.DeliveryDetails.IDImage,
      imageType: "base64",
    };
    obj.imageObj.push(imageObj);
  }
  if (Scans.DeliveryDetails && Scans.DeliveryDetails.Signature) {
    let imageObj = {
      imagekey: `Signature`,
      imageValue: Scans.DeliveryDetails.Signature,
      imageType: "base64",
    };
    obj.imageObj.push(imageObj);
  }
  if (Scans.QCFailed && Scans.QCFailed.Pictures && Array.isArray(Scans.QCFailed.Pictures)) {
    const {Pictures} = Scans.QCFailed
    Pictures.map((v,k)=>{
      imageCount++;
      let imageObj = {
        imagekey: `Pictures${imageCount}`,
        imageValue: v,
        imageType: "base64",
      };
      obj.imageObj.push(imageObj);
    })
   
  }
  obj.apiName = data.apiName;
  log.info(functionName, "request body for coreapi", obj);
  const result = await downStreamApiCallerFunction(obj);
  return result;
};

module.exports = uploadImagesToLogistics;
