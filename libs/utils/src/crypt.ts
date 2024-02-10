import * as crypto from 'node:crypto';

// Algorithm AND Key
const algorithm = 'sha512';
const key = 'a@45_hash';

// Random Value Generator Function
export const hashIt = function (data: string) {
  var sha = crypto.createHash('sha1');
  sha.update(data + '', 'ascii');
  return sha.digest('hex');
};

// export const generate = function (data) {
//   return token.generate(data.toString());
// };

export const createKeyPair = function (text: string, cb: Function) {
  var hash;
  var hmac = crypto.createHmac(algorithm, key);
  // readout format:
  hmac.setEncoding('hex');
  // or also commonly: hmac.setEncoding('base64')

  // callback is attached as listener to stream's finish event:
  hmac.end(text, function () {
    hash = hmac.read();
    // ...do something with the hash...
    // log.info(hash)

    cb(hash);
  });
};

export const encryptMessage = function (
  text: string,
  k: crypto.BinaryLike,
  cb: Function
) {
  var hash;
  var hmac = crypto.createHmac(algorithm, k);
  // readout format:
  hmac.setEncoding('hex');
  // or also commonly: hmac.setEncoding('base64')
  // callback is attached as listener to stream's finish event:
  hmac.end(text, function () {
    hash = hmac.read();
    // ...do something with the hash...
    // log.info('signture')
    // log.info(hash)
    cb(hash);
  });
};

export const validateSignature = function (
  text: string,
  signature: string,
  privateKey: string,
  cb: Function
) {
  encryptMessage(text, privateKey, function (hash: string) {
    if (signature === hash) {
      console.log(
        'Signature is Valid =>>>> validateSignature func()  SIGNATURE == HASH MATCHED '
      );
      // cb(true)
      cb({ status: true, hash: hash });
    } else {
      console.log(signature + ' !== \n' + hash);
      cb({ status: false, hash: hash });
    }
  });
};

export const random = function (howMany: number, chars: string) {
  chars = chars || '0123456789';
  var rnd = crypto.randomBytes(howMany),
    value = new Array(howMany),
    len = chars.length;

  for (var i = 0; i < howMany; i++) {
    value[i] = chars[rnd[i] % len];
  }

  return value.join('');
};
