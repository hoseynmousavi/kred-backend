import companyController from "../controllers/companyController"

const companyRouter = (app) =>
{
    app.route("/company")
        .get(companyController.getCompanies)
        .post(companyController.addCompany)

    app.route("/company/category")
        .get(companyController.getCompanyCategories)
        .post(companyController.addCompanyCategory)
}

export default companyRouter