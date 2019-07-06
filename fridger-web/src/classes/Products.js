export class ProductTemplate {
    constructor(productName, barCode) {
        this.productName = productName
        this.barCode = (barCode) ? barCode : undefined
        this.id = `${productName}#${barCode ? barCode : '-'}`
    }
}