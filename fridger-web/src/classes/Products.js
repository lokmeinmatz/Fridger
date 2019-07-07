export class ProductTemplate {
    constructor(productName, barCode) {
        this.productName = productName
        this.barCode = (barCode) ? barCode : undefined
        this.id = `${productName}#${barCode ? barCode : '-'}`
    }
}

export class ProductInstance {
    constructor(template, instanceID, bestBefore) {
        this.template = template
        this.instanceID = instanceID
        this.bestBefore = bestBefore
    }
}