export default  defineEventHandler(async (event) => {
    if (getMethod(event) !== 'POST') return
    const body = await readBody(event)

    const company_id = "784815"

    const url = "https://api.alteg.io/api/v1"
    const headers = {
        "Authorization": "Bearer fmrkm4w8sktt9fsjzhaw, User 9bfbbdd6b8ca624ae4d2f9ef499bd7ff",
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
            const res =  await fetch(`${url}/book_dates/${company_id}?service_ids=${service_id}${body?.date_from ? `&date_from=${body.date_from}` : ''}${body?.date_to ? `&date_to=${body.date_to}` : ''}`, {
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
            const service_id = body.service_id
            const promises = staff_ids.map(async staff_id => {
                const res =  await fetch(`${url}/book_times/${company_id}/${staff_id}/${date}?service_ids=${service_id}`, {
                    method: "GET",
                    headers
                })
                const data = await res.json()
                data.staff_id = staff_id
                return data
            })
            let resAll = await Promise.all(promises)
            resAll = resAll.filter(r => r.success)
            if (resAll?.length < 1) return {success: false}

            let allData = []
            resAll?.forEach(d => {
                d?.data?.forEach(dd => dd.staff_id = d.staff_id)
                allData.push(...d?.data)
            })

            // Remove dublicated hours
            const ids = [];
            let _allData = [];
            allData?.forEach(item => {
                // // all slots
                // _allData.push(item)

                // filtered slots by dublicated time
                const id = item.time
                if (!ids.includes(id)) {
                    ids.push(id)
                    _allData.push(item)
                    // console.log('not', id, item.staff_id);

                } else {
                    // Add dublicated times into Array
                    let t = []
                    const index = _allData.findIndex(it => it.time === item.time)
                    if (index!== -1) {
                        Array.isArray(_allData[index]) ? t = _allData[index] : t = [_allData[index]]

                        _allData[index] = [...t, item]
                        // console.log('dublicated', id, item.staff_id);
                    }

                }
            })

            // Randomize by staff_id
            for (let i = 0; i < _allData?.length; i++) {
                if (Array.isArray(_allData[i])) {
                    const ind = getRandomInt(0, _allData[i]?.length - 1)
                    _allData[i] = _allData[i][ind]
                    // console.log(allData[i][ind-1]);
                }
            }


            // Sort by time
            _allData = _allData.sort((a, b) => {
                return new Date(a.datetime) - new Date(b.datetime)
            })

            return {success: true, data: _allData}

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


            const res =  await fetch(`${url}/records/${company_id}`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    "client": {
                        "phone": phone,
                        "name": fullName,
                        "email": email,
                    },
                    "comment": comment,
                    "seance_length": 3600,
                    "staff_id": staff_id,
                    "datetime": date,
                    "services": [
                        {"id": services_id}
                    ]
                })
            })
            return await res.json()
        } catch (e) {
            throw e
        }
    }

})


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
