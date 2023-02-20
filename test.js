const {encode, decode} = require('gpt-3-encoder')

const str = 'Hello, how are you? | Hola, ¿como vas?'
const encoded = encode(str)
console.log('Encoded this string looks like: ', encoded)

console.log('We can look at each token and what it represents')
for(let token of encoded){
  console.log({token, string: decode([token])})
}

const decoded = decode(encoded)
console.log('We can decode it back into:\n', decoded)