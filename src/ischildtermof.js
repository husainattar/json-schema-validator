'use strict';

var request = require('request');

module.exports = function defFunc(ajv) {
  defFunc.definition = {
    async: true,
    type: 'array',
    validate: checkIsChildTermOf,
    errors: true
  };

  function checkIsChildTermOf(schema, data) {
    return new Promise(function(resolve, reject) {
      const parentTerm = schema.parentTerm;
      const ontology = schema.ontology;
      const termsArray = data;

      let errorCount = 0;
      let errors = [];
      for (var i = 0; i < termsArray.length; i++) { // loop through all provided terms
        const url = "https://www.ebi.ac.uk/ols/api/ontologies/" + ontology + "/terms?iri=" + termsArray[i];

        findParentTerm(url, parentTerm).then(function(result) {
          if (result) {
            resolve(result);
          } else {
            errorCount++;
            errors.push('No child term of ' + parentTerm + ' found.')
            if (errorCount === termsArray.length) {
              resolve(errors)
            }
          }
        }).catch(function(){
          errorCount++;
          errors.push('Could not access OLS API to check parent term.');
          if (errorCount === termsArray.length) {
            resolve(errors)
          }
        });
      }
    });
  }

  function findParentTerm(url, parentTerm, responseBody, promiseParam, resolveParam, rejectParam) {

    if (!promiseParam && !resolveParam && !rejectParam) {
      promiseParam = new Promise(function(resolve, reject) {
        resolveParam = resolve;
        rejectParam = reject;
      });
    }

    if (responseBody) {
      let jsonBody = JSON.parse(responseBody);
      if (jsonBody._embedded.terms[0].iri === parentTerm) {
        resolve(true);
      }
      if (jsonBody._embedded.terms[0].is_root) {
        resolve(false);
      }
    }

    console.log('Calling: ', url);
    request(url, function(error, response, body) {
      if (error === null && response.statusCode === 200) {
        let jsonBody = JSON.parse(body);
        let parentUrl = jsonBody._embedded.terms[0]._links.parents.href;
        findParentTerm(parentUrl, parentTerm, body, promiseParam, resolveParam, rejectParam);
      } else {
        reject(error);
      }
    });
    return promiseParam;
  }

  ajv.addKeyword('isChildTermOf', defFunc.definition);
  return ajv;
};
