export default  defineEventHandler(async (event) => {
    if (getMethod(event) !== 'POST') return
    const body = await readBody(event)

    const company_id = "784815"

    const url = "https://api.alteg.io/api/v1"
    const headers = {
        "Authorization": "Bearer e6jygaxjnjtue285xsj8, User 294753996966c527f79d732ebe73c256",
        "Accept": "application/vnd.api.v2+json",
        "Content-Type": "application/json"
    }

    if (body.type === "services") {
        try {
            const res =  await fetch(`${url}/company/${company_id}/services`, {
                method: "GET",
                headers
            })
            return await res.json()
        } catch (e) {
            throw e
        }
    }
    if (body.type === "days") {
        try {
            const service_id = body.service_id
            const res =  await fetch(`${url}/book_dates/${company_id}?service_ids=${service_id}`, {
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
            const staff_ids = body.staff_ids

            const promises = staff_ids.map(async staff_id => {
                const res =  await fetch(`${url}/book_times/${company_id}/${staff_id}/${date}`, {
                    method: "GET",
                    headers
                })
                const data = await res.json()
                data.staff_id = staff_id
                return data
            })
            let resAll = await Promise.all(promises)
            resAll = resAll.filter(r => r.success)
            if (resAll.length < 1) return {success: false}

            let allData = []
            resAll.forEach(d => {
                d.data.forEach(dd => dd.staff_id = d.staff_id)
                allData.push(...d.data)
            })

            // Remove dublicated hours
            const ids = allData.map((d) => d.time + d.seance_length);
            allData = allData.filter(function(item, index) {
                return !ids.includes(item, index + 1)
            })

            // Sort by time
            allData = allData.sort((a, b) => {
                return new Date(a.datetime) - new Date(b.datetime)
            })

            return {success: true, data: allData}

            // allData

            // console.log({resAll});
            return

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
            const staff_id = body.staff_id
            const services_id = body.services_id


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
