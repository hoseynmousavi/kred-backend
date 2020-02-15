import mongoose from "mongoose"
import companyModel from "../models/companyModel"

const company = mongoose.model("company", companyModel)

const getCompanies = (req, res) =>
{
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 9
    const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
    company.find(null, null, {skip, limit}, (err, companies) =>
    {
        if (err) res.status(400).send(err)
        else res.send(companies)
    })
}

const addCompany = (req, res) =>
{
    if (req.headers.authorization.role === "admin")
    {
        const picture = req.files ? req.files.picture : null
        if (picture)
        {
            const picName = new Date().toISOString() + picture.name
            picture.mv(`media/pictures/${picName}`, (err) =>
            {
                if (err) console.log(err)
                delete req.body.created_date
                const newCompany = new company({...req.body, picture: `media/pictures/${picName}`})
                newCompany.save((err, createdCompany) =>
                {
                    if (err)
                    {
                        console.log(err)
                        res.status(400).send(err)
                    }
                    else res.send(createdCompany)
                })
            })
        }
        else res.status(400).send({message: "send picture!"})
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const companyController = {
    getCompanies,
    addCompany,
}

export default companyController