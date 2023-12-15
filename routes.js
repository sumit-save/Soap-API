const soapRequest = require("easy-soap-request");
const express = require("express");
const xml2js = require("xml2js");

const router = new express.Router();

// Coordinates based on zipcode
router.get("/coordinates/:zipcode", async (req, res) => {
    try {
        const url = "https://graphical.weather.gov/xml/SOAP_server/ndfdXMLserver.php";
        const headers = {
            "user-agent": "sampleTest",
            "Content-Type": "text/xml;charset=UTF8",
            "soapAction": "https://graphical.weather.gov/xml/DWMLgen/wsdl/ndfdXML.wsdl#LatLonListZipCode"
        };
        const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="https://graphical.weather.gov/xml/DWMLgen/wsdl/ndfdXML.wsdl">
         <soapenv:Header/>
          <soapenv:Body>
           <web:LatLonListZipCodeRequest>
              <web:zipCodeList>${req.params.zipcode}</web:zipCodeList>
           </web:LatLonListZipCodeRequest>
         </soapenv:Body>
        </soapenv:Envelope>`;
        const { response } = await soapRequest({
            url: url,
            headers: headers,
            xml: xml
        });
        if (response.statusCode === 200) {
            const latLongList = await xml2js.parseStringPromise(response.body, { explicitArray: false, ignoreAttrs: true });
            const result = latLongList["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns1:LatLonListZipCodeResponse"]["listLatLonOut"];
            const latLongListData = await xml2js.parseStringPromise(result, { explicitArray: false, mergeAttrs: true });
            const resultData = latLongListData["dwml"]["latLonList"].split(",");
            return res.status(200).json({ status: 200, message: "OK", data: { latitude: resultData[0], longitude: resultData[1], zipcode: req.params.zipcode } });
        } else {
            return res.status(400).json({ status: 400, message: "BAD REQUEST", data: null });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: "INTERNAL SERVER ERROR", data: null });
    }
});

module.exports = router;
