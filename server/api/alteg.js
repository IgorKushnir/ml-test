export default  defineEventHandler(async (event) => {
    if (getMethod(event) !== 'POST') return
    const body = await readBody(event)

    const company_id = "784815"
    const staff_id = "2237729"
    const services_id = "10989919"

    const url = "https://api.alteg.io/api/v1"
    const headers = {
        "Authorization": "Bearer e6jygaxjnjtue285xsj8, User 294753996966c527f79d732ebe73c256",
        "Accept": "application/vnd.api.v2+json",
        "Content-Type": "application/json"
    }

    if (body.type === "days") {
        try {
            const res =  await fetch(`${url}/book_dates/${company_id}`, {
                method: "GET",
                headers
            })
            return await res.json()
        } catch (e) {
            throw e
        }
    }
    if (body.type === "hours") {
        try {
            const date = body.date
            const res =  await fetch(`${url}/book_times/${company_id}/${staff_id}/${date}`, {
                method: "GET",
                headers
            })
            return await res.json()
        } catch (e) {
            throw e
        }
    }

    if (body.type === "appointment") {
        try {
            const date = body.date
            const phone = body.phone
            const fullName = body.fullName
            const email = body.email
            const comment = body.comment


            const res =  await fetch(`${url}/book_record/${company_id}`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    "phone": phone,
                    "fullname": fullName,
                    "email": email,
                    "comment": comment,
                    "appointments": [
                        {
                            "id": 1,
                            "staff_id": staff_id,
                            "datetime": date,
                            "services": [
                                services_id
                            ]
                        }
                    ]
                })
            })
            return await res.json()
        } catch (e) {
            throw e
        }
    }

})
