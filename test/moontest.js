/*jshint expr: true*/
var moonfish = require('../moonfish'),
    csvdata = moonfish.moondata;

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('MoonFish.js Unit Test', function() {

  it('(moonfish) true should be true', function(){
    expect(true).eql(true);
  });
});
