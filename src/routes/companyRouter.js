import companyController from "../controllers/companyController"

const companyRouter = (app) =>
{
    app.route("/company")
        .get(companyController.getCompanies)
        .post(companyController.addCompany)
}

export default companyRouter