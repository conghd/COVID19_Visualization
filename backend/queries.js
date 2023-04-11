
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'conghd',
  host: 'db.bit.io',
  database: 'conghd/covid19',
  password: 'v2_42vVu_X7SqaUxrKHGkveV2LA3e98d',
  port: 5432,
  ssl: true,
})

//postgresql://conghd:v2_42vVu_X7SqaUxrKHGkveV2LA3e98d@db.bit.io:5432/conghd/covid19

const getRegions = (request, response) => {
    pool.query('SELECT * FROM regions ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

const getCases = (request, response) => {
    pool.query("select r.*, c.date, c.count, c.total from confirmed_cases c, regions r \
    where c.region_id = r.id and c.date = '2023-03-09'", (error, results) => {
        if (error) {
            throw error
        }
    response.status(200).json(results.rows)
    })

}

const getTotalCases = (request, response) => {
    const { region_id, from, to} = request.params
    console.log("region: " + region_id)
    console.log("from: " + from)
    console.log("to: " + to)
    let sql = "select date_trunc('week', c.date) as date, sum(c.count) as total from confirmed_cases c, regions r \
    where c.region_id = r.id "
    let params = []
    if (region_id != "0" && region_id != 0) {
      sql = sql + " AND c.region_id = $1"
      params.push(region_id)
      if (from != "" && to != "") {
        sql = sql + " AND c.date >= $2 AND c.date <= $3";
        params.push(from)
        params.push(to)
      }

    } else {
      if (from != "" && to != "") {
        sql = sql + " AND c.date >= $1 AND c.date <= $2";
        params.push(from)
        params.push(to)
      }
    }

    sql = sql + " GROUP BY(date)"
    //sql = sql + " GROUP BY(c.date)"
    //sql = sql + " GROUP BY WEEK(FROM_UNIXTIME(c.date))"
      
    pool.query(sql, params, (error, results) => {
        if (error) {
            throw error
        }
    response.status(200).json(results.rows)
    })
}

const getTotalDeaths = (request, response) => {
  const { region_id, from, to} = request.params
  console.log("region: " + region_id)
  console.log("from: " + from)
  console.log("to: " + to)
  let sql = "select date_trunc('week', c.date) as date, sum(c.count) as total from deaths c, regions r \
  where c.region_id = r.id "
  let params = []
  if (region_id != "0" && region_id != 0) {
    sql = sql + " AND c.region_id = $1"
    params.push(region_id)
    if (from != "" && to != "") {
      sql = sql + " AND c.date >= $2 AND c.date <= $3";
      params.push(from)
      params.push(to)
    }

  } else {
    if (from != "" && to != "") {
      sql = sql + " AND c.date >= $1 AND c.date <= $2";
      params.push(from)
      params.push(to)
    }
  }

  sql = sql + " GROUP BY(date)"
  //sql = sql + " GROUP BY(c.date)"
  //sql = sql + " GROUP BY WEEK(FROM_UNIXTIME(c.date))"
    
  pool.query(sql, params, (error, results) => {
      if (error) {
          throw error
      }
  response.status(200).json(results.rows)
  })
}

module.exports = {
    getRegions,
    getCases,
    getTotalCases,
    getTotalDeaths
}


  /* Schema */
  /*


  CREATE TABLE regions (
   ID INT PRIMARY KEY      NOT NULL,
   COUNTRY CHAR(50) NOT NULL,
   PROVINCE CHAR(50),
   CITY CHAR(50),
   LAT  REAL NOT NULL,
   LONG REAL NOT NULL
);

CREATE INDEX INDEX_COUNTRY ON regions(COUNTRY);
CREATE INDEX INDEX_PROVINCE ON regions(PROVINCE);
CREATE INDEX INDEX_CITY ON regions(CITY);


Afghanistan	33.93911	67.709953
Albania	41.1533	20.1683
Algeria	28.0339	1.6596
Andorra	42.5063	1.5218
Angola	-11.2027	17.8739
Antarctica	-71.9499	23.347
Antigua and Barbuda	17.0608	-61.7964
Argentina	-38.4161	-63.6167
Armenia	40.0691	45.0382

*/