import multer from "multer";

// https://github.com/expressjs/multer/blob/master/README.md
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + uniqueSuffix); // cb -> callback
  },
});

export const upload = multer({ storage: storage });
