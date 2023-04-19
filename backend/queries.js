/*
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'conghd',
  host: 'db.bit.io',
  database: 'conghd/covid19',
  password: 'v2_42vVu_X7SqaUxrKHGkveV2LA3e98d',
  port: 5432,
  ssl: true,
})
*/

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db/covid19.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
})

//postgresql://conghd:v2_42vVu_X7SqaUxrKHGkveV2LA3e98d@db.bit.io:5432/conghd/covid19

const getRegions2 = (request, response) => {
    let sql = 'SELECT * FROM regions ORDER BY id ASC';
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.log("ERR: " + err)
      }
      response.status(200).json(rows)
    });

}

/*
const getRegions = (request, response) => {
    pool.query('SELECT * FROM regions ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
*/
const getCases2 = (request, response) => {
    db.all("select r.*, c.date, c.count, c.total from cases c, regions r \
    where c.region_id = r.id and c.date = '2023-03-09'", (error, rows) => {
        if (error) {
            throw error
        }
    response.status(200).json(rows)
    })

}

/*
const getCases = (request, response) => {
    pool.query("select r.*, c.date, c.count, c.total from confirmed_cases c, regions r \
    where c.region_id = r.id and c.date = '2023-03-09'", (error, results) => {
        if (error) {
            throw error
        }
    response.status(200).json(results.rows)
    })
}
*/

const getTotalCases2 = (request, response) => {
    const { region, from, to} = request.params
    console.log("region: " + region)
    console.log("from: " + from)
    console.log("to: " + to)
    let sql = "select c.date, sum(c.count) as total from cases c, regions r \
    where c.region_id = r.id "
    let params = []
    if (region != "world") {
      sql = sql + " AND r.country= ?"
      params.push(region)
      if (from != "" && to != "") {
        sql = sql + " AND c.date >= ? AND c.date <= ?";
        params.push(from)
        params.push(to)
      }

    } else {
      if (from != "" && to != "") {
        sql = sql + " AND c.date >= ? AND c.date <= ?";
        params.push(from)
        params.push(to)
      }
    }

    sql = sql + " GROUP BY(date)"
    //sql = sql + " GROUP BY(c.date)"
    //sql = sql + " GROUP BY WEEK(FROM_UNIXTIME(c.date))"
      
    db.all(sql, params, (error, rows) => {
        if (error) {
            throw error
        }
    response.status(200).json(rows)
    })
}

/*
const getTotalCases = (request, response) => {
    const { region, from, to} = request.params
    console.log("region: " + region)
    console.log("from: " + from)
    console.log("to: " + to)
    let sql = "select date_trunc('week', c.date) as date, sum(c.count) as total from confirmed_cases c, regions r \
    where c.region_id = r.id "
    let params = []
    if (region != "world") {
      sql = sql + " AND r.country= $1"
      params.push(region)
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
*/

const getTotalDeaths2 = (request, response) => {
  const { region, from, to} = request.params
  console.log("region: " + region)
  console.log("from: " + from)
  console.log("to: " + to)
  let sql = "select c.date, sum(c.count) as total from deaths c, regions r \
  where c.region_id = r.id "
  let params = []
  if (region!= "world") {
    sql = sql + " AND r.country = $1"
    params.push(region)
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
    
  db.all(sql, params, (error, rows) => {
      if (error) {
          throw error
      }
  response.status(200).json(rows)
  })
}

/*
const getTotalDeaths = (request, response) => {
  const { region, from, to} = request.params
  console.log("region: " + region)
  console.log("from: " + from)
  console.log("to: " + to)
  let sql = "select date_trunc('week', c.date) as date, sum(c.count) as total from deaths c, regions r \
  where c.region_id = r.id "
  let params = []
  if (region!= "world") {
    sql = sql + " AND r.country = $1"
    params.push(region)
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
*/
module.exports = {
    getRegions2,
    //getRegions,
    //getCases,
    getCases2,
    //getTotalCases,
    getTotalCases2,
    //getTotalDeaths,
    getTotalDeaths2
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