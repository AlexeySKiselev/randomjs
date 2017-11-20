/** Tests
 * For Visualization uses "d3node-barchart" package
 * Created by Alexey on 24.08.2017.
 */

// Import Mocha tool for tests
let chai = require('chai'),
    expect = chai.expect,
    {describe, it} = require('mocha');

chai.should();

// TODO: after implementation analyser add more test for each distribution for comparing real parameters with expected ones

// Uniform distribution
describe('Uniform distribution',() => {
    let Uniform = require('../lib/methods/uniform');
    it('requires two numerical arguments', () => {
        let zeroParams = () => {
            let uniform = new Uniform();
            if(uniform.isError())
                throw new Error(uniform.isError());
        };
        zeroParams.should.throw(Error);

        let oneParam =  () => {
            let uniform = new Uniform(1);
            if(uniform.isError())
                throw new Error(uniform.isError());
        };
        oneParam.should.throw(Error);

        let badParams = () => {
            let uniform = new Uniform('a', 'b');
            if(uniform.isError())
                throw new Error(uniform.isError());
        };
        badParams.should.throw(Error);

        let goodParams = () => {
            let uniform = new Uniform(0, 1);
            if(uniform.isError())
                throw new Error(uniform.isError());
        };
        goodParams.should.not.throw(Error);
    });
    it('should have mean value for min = 1 and max = 3 equals to 2',() => {
        let uniform = new Uniform(1, 3);
        expect(uniform.mean).to.be.a('number');
        uniform.mean.should.equal(2);
    });
    it('should have mean value for initial min = 1 and max = 3 equals to 3 after .refresh(2, 4) method',() => {
        let uniform = new Uniform(1, 3);
        uniform.refresh(2, 4);
        uniform.mean.should.equal(3);
    });
    it('should has methods: .random, .distribution, .refresh, .isError', () => {
        let uniform = new Uniform(1, 5);
        expect(uniform).to.have.property('random');
        expect(uniform).to.respondsTo('random');
        expect(uniform).to.have.property('distribution');
        expect(uniform).to.respondsTo('distribution');
        expect(uniform).to.have.property('refresh');
        expect(uniform).to.respondsTo('refresh');
        expect(uniform).to.have.property('isError');
        expect(uniform).to.respondsTo('isError');
    });
    it('should return different values each time and these values should be 1 <= <values> <= 5', () => {
        let uniform = new Uniform(1, 5),
            value1 = uniform.random();
        expect(uniform.random()).to.be.a('number');
        expect(uniform.random()).to.be.within(1, 5);
        uniform.random().should.not.equal(value1);
    });
    it('should generate an array with random values between 1 and 5 with length of 500', () => {
        let uniform = new Uniform(1, 5),
            randomArray = uniform.distribution(500),
            min = 6,
            max = 0,
            countDiffs = 0,
            last,
            delta = 0.2;
        // Check all values
        randomArray.map(rand => {
            if(rand < min) {
                min = rand;
            }
            if(rand > max) {
                max = rand;
            }
            if(last && Math.abs(rand - last) > delta){
                countDiffs += 1;
            }
            last = rand;
        });
        expect(randomArray).to.be.an('array');
        expect(randomArray).to.have.lengthOf(500);
        expect(countDiffs).to.be.at.least(200);
        expect(min).to.be.at.least(1);
        expect(max).to.be.at.most(5);
    });
});

// Normal Distribution
describe('Normal distribution', () => {
    let Normal = require('../lib/methods/normal');
    it('requires two numerical arguments', () => {
        let zeroParams = () => {
            let normal = new Normal();
            if(normal.isError())
                throw new Error(normal.isError());
        };
        zeroParams.should.throw(Error);

        let oneParam =  () => {
            let normal = new Normal(1);
            if(normal.isError())
                throw new Error(normal.isError());
        };
        oneParam.should.throw(Error);

        let badParams = () => {
            let normal = new Normal('a', 'b');
            if(normal.isError())
                throw new Error(normal.isError());
        };
        badParams.should.throw(Error);

        let goodParams = () => {
            let normal = new Normal(1.5, 2);
            if(normal.isError())
                throw new Error(normal.isError());
        };
        goodParams.should.not.throw(Error);
    });
    it('should has methods: .random, .distribution, .refresh, .isError', () => {
        let normal = new Normal(1, 2);
        expect(normal).to.have.property('random');
        expect(normal).to.respondsTo('random');
        expect(normal).to.have.property('distribution');
        expect(normal).to.respondsTo('distribution');
        expect(normal).to.have.property('refresh');
        expect(normal).to.respondsTo('refresh');
        expect(normal).to.have.property('isError');
        expect(normal).to.respondsTo('isError');
    });
    it('should have mean value for mu = 1.5 and sigma = 2 equals to mu',() => {
        let normal = new Normal(1.5, 3);
        expect(normal.mean).to.be.a('number');
        normal.mean.should.equal(1.5);
    });
    it('should have mean value for initial mu = 1.5 and sigma = 2 equals to 2.5 after .refresh(2.5, 4) method',() => {
        let normal = new Normal(1.5, 2);
        normal.mean.should.equal(1.5);
        normal.sigma.should.equal(2);
        normal.refresh(2.5, 4);
        normal.mean.should.equal(2.5);
        normal.sigma.should.equal(4);
    });
    it('should return different values each time', () => {
        let normal = new Normal(1.5, 2),
            value1;
        for(let i = 0; i < 10; i += 1){
            value1 = normal.random();
            expect(normal.random()).to.be.a('number');
            normal.random().should.not.equal(value1);
        }
    });
    it('should generate an array with random values between 1 and 5 with length of 500', () => {
        let normal = new Normal(1.5, 2),
            randomArray = normal.distribution(500),
            countDiffs = 0,
            last,
            delta = 0.2;
        // Check all values
        randomArray.map(rand => {
            if(last && Math.abs(rand - last) > delta){
                countDiffs += 1;
            }
            last = rand;
        });
        expect(randomArray).to.be.an('array');
        expect(randomArray).to.have.lengthOf(500);
        expect(countDiffs).to.be.at.least(300);
    });
});
