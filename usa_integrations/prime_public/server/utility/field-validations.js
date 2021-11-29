var validations = [{
    "Source": "Default",
    "EndPoint": "/ServiceRequest/scheduleRequest",
    "FieldValidations": [
        {
            "FieldName": "p.b",
            "MappedField": "Brand",
            "Type": "String",
            "IsMandatory": false
        },
        {
            "FieldName": "p",
            "MappedField": "Product",
            "Type": "Object",
            "IsMandatory": false,
            "RequiredFields": [
                "b",
                "sID"
            ]
        },
        {
            "FieldName": "p.sID",
            "MappedField": "SubCategoryID",
            "Type": "Number",
            "IsMandatory": true
        },
        {
            "FieldName": "Source",
            "MappedField": "Source",
            "Type": "String",
            "IsMandatory": true
        }
    ]
}]
exports.validations = validations