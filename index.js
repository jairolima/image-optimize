import express from "express";
import sharp from "sharp";
import axios from "axios";

const app = express();
const port = 3000;

app.get("/:picture/:w/:h", async (req, res) => {
  //encodeURIComponent(https://www.esfera.com.vc/file/v8699338928218651370/general/20221220_homepts_rsgt_smiles_desk.jpg)

  const { picture, w, h } = req.params;

  const imageBuffer = (
    await axios({
      url: decodeURIComponent(picture),
      responseType: "arraybuffer",
    })
  ).data;

  const data = await sharp(imageBuffer)
    .resize(Number(w), Number(h), {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0.5 },
    })
    .webp({ lossless: true })
    .toBuffer();

  const b64 = data.toString("base64");

  const mimeType = "image/webp"; // e.g., image/png

  res.send(`<img src="data:${mimeType};base64,${b64}" />`);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
