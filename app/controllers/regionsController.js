const csv = require("csvtojson");
const path = require("path");

async function getProvinsi(req, res, next) {
  const db_provinsi = path.resolve(__dirname, "../utils/data/provinsi.csv");
  try {
    const data = await csv().fromFile(db_provinsi);
    return res.status(200).json({
      status: 200,
      totalData: data.length,
      data: data,
    });
  } catch (error) {
    //   console.log(error)
    return res.status(400).json({
      error: 1,
      message: "Tidak dapat mengambil data provinsi, hubungi admin segera!",
    });
  }
}

async function getKotakab(req, res, next) {
  const db_kotakab = path.resolve(__dirname, "../utils/data/kotakab.csv");
  try {
    let { kode: kode_provinsi } = req.query;
    let data = await csv().fromFile(db_kotakab);
    data = data.filter((kotakab) => kotakab.kode_provinsi === kode_provinsi);
    return res.status(200).json({
      status: 200,
      totalData: data.length,
      data: data,
    });
  } catch (error) {
    //   console.log(error)
    return res.status(400).json({
      error: 1,
      message: "Tidak dapat mengambil data provinsi, hubungi admin segera!",
    });
  }
}

async function getKecamatan(req, res, next) {
  const db_kecamatan = path.resolve(__dirname, "../utils/data/kecamatan.csv");
  try {
    let { kode: kode_kota } = req.query;
    let data = await csv().fromFile(db_kecamatan);
    data = data.filter((kecamatan) => kecamatan.kode_kota === kode_kota);
    return res.status(200).json({
      status: 200,
      totalData: data.length,
      data: data,
    });
  } catch (error) {
    //   console.log(error)
    return res.status(400).json({
      error: 1,
      message: "Tidak dapat mengambil data provinsi, hubungi admin segera!",
    });
  }
}

async function getKelurahan(req, res, next) {
  const db_kelurahan = path.resolve(__dirname, "../utils/data/kelurahan.csv");
  try {
    let { kode: kode_kecamatan } = req.query;
    let data = await csv().fromFile(db_kelurahan);
    data = data.filter(
      (kelurahan) => kelurahan.kode_kecamatan === kode_kecamatan
    );
    return res.status(200).json({
      status: 200,
      totalData: data.length,
      data: data,
    });
  } catch (error) {
    //   console.log(error)
    return res.status(400).json({
      error: 1,
      message: "Tidak dapat mengambil data provinsi, hubungi admin segera!",
    });
  }
}

module.exports = {
  getProvinsi,
  getKotakab,
  getKecamatan,
  getKelurahan
};
