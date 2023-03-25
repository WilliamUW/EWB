const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + "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"
};

console.log("getPageMetas - begin")

// array with relevant details for evaluation
const result = []; // Declare and initialize result variable here


var metas = document.getElementsByTagName('meta'); 
var metaArr = [];
for (var i=0; i<metas.length; i++) { 
    var name = metas[i].getAttribute("name");
    var property = metas[i].getAttribute("property");
    var httpequiv = metas[i].getAttribute("http-equiv");
    var content = metas[i].getAttribute("content");
    var charset = metas[i].getAttribute("charset");
    metaArr.push([name, property, httpequiv, content, charset]);
} 



console.log("got metas")
console.log("metaArr information: ", metaArr)

// get product title, description, manufacturer from metaArr
var title = "";
var ingredients = "";
var packaging = "";
var company = document.domain;

for (var i=0; i<metaArr.length; i++) {
    if (metaArr[i][0] === "title") {
        title = metaArr[i][3];
    } else if (metaArr[i][0] === "description") {
        var desc = metaArr[i][3].toLowerCase();
        ingredients = desc;
        // if (desc.includes("ingredients")) {
        //     ingredients = desc.split("ingredients: ")[1];
        // } else if (desc.includes("packaging")) {
        //     packaging = desc.split("packaging: ")[1];
        // }
    }
}

console.log("title", title)
console.log("ingredients", ingredients)
console.log("packaging", packaging)
console.log("checkpoint 1")

const score_prompt = `
Provide a score between 0 and 100 regarding the cyber ethics and digital rights of the company: ${company}. Return a number only.`

console.log("score_prompt", score_prompt)

const product_explanation_prompt = `
Give a one paragraph explanation regarding the strengths of the cyber ethics and digital rights of the company: ${company} and
one paragraph explanation regarding the weaknesses of the cyber ethics and digital rights of the company: ${company}. 
Finally a one paragraph explanation regarding the overall state of the cyber ethics and digital rights of the company: ${company}. Be concise and use bullet points.`

console.log("product_explanation_prompt", product_explanation_prompt)

const alternative_prompt = `
Find 3 alternative websites that are similar to the company: ${company} that have better cyber ethics and digital rights. They must score equal or better than ${company} between 0 and 100. Only reply with the name and score.`

//const users_prompt = `How many total users does ${company} have? Return a number only.`
const type_data_prompt = `What type of data does ${company} collect from its users? Reply concisely and separate the types with commas.`
const breaches_prompt = `Give one short paragraph about the breach potential in ${company}'s industry.`
const risk_prompt = `What is the risk of data exposure using ${company}'s services?`

console.log("alternative_prompt", alternative_prompt)

let dataBreach = "Oct 2020";
switch(document.domain) {
    case "www.google.com":
      // code block
      dataBreach = "Jan 2023"
      break;
    case "www.snapchat.com":
    // code block
    dataBreach = "Mar 2022"
    break;
    case "facebook.com":
    dataBreach = "Apr 2021"
      // code block
      break;
      case "www.instagram.com":
    // code block
    dataBreach = "Jan 2021"
    break;
    default:
      // code block
  }
const url = "https://api.openai.com/v1/engines/text-davinci-003/completions";
const body = {
    prompt: [score_prompt, product_explanation_prompt, alternative_prompt],
    max_tokens: 2000,
    n: 1,
    stop: ""
};

const body2= {
    prompt: [type_data_prompt, breaches_prompt, risk_prompt],
    max_tokens: 2000,
    n: 1,
    stop: ""
};

const testing = false;
if (!testing){
fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: headers
}).then(response => {
    console.log("11111111")
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("ChatGPT API request failed.");
    }
}).then(data => {
    console.log(data.choices);
    chrome.runtime.sendMessage({
        method:"getMetas",
        metas:metaArr,
        dataBreach: dataBreach,
        domain: document.domain,
        score:data.choices[0].text.trim(),
        product_explanation:data.choices[1].text.trim(),
        alternatives:data.choices[2].text.trim()
    });
}).catch(error => {
    console.error(error);
}).finally(() => {
    console.log("getResponse1 - end");
})
    // Second request
    fetch(url, {
        method: "POST",
        body: JSON.stringify(body2),
        headers: headers,
    })
        .then((response) => {
            console.log("22222222");
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("ChatGPT API request failed.");
            }
        })
        .then((data) => {
            console.log(data.choices);
            chrome.runtime.sendMessage({
                method: "getMetas2",
                metas: metaArr,
                dataBreach: dataBreach,
                domain: document.domain,
                type_data: data.choices[0].text.trim(),
                breaches: data.choices[1].text.trim(),
                risk: data.choices[2].text.trim(),
            });
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            console.log("getResponse2 - end");
        })
};

