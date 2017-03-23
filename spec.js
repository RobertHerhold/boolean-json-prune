const expect = require('chai').expect;
const prune = require('./index');

describe('Prune Boolean JSON', function() {
    it('should prune unnecessary conjunction expressions', function() {
        const input = {
            and: ['foo', 'bar', {
                and: ['baz', 'foo2']
            }]
        };

        expect(prune(input)).to.eql({
            and: ['foo', 'bar', 'baz', 'foo2']
        });
    });

    it('should prune unnecessary conjunction expressions (deeply nested example)', function() {
        const input = {
            and: [{
                and: [{
                    and: ['foo', 'bar']
                }, {
                    and: ['foo2', 'bar2']
                }]
            }, {
                and: [{
                    and: ['foo3', 'bar3']
                }, {
                    and: ['foo4', 'bar4']
                }]
            }]
        };

        expect(prune(input)).to.eql({
            and: ['foo', 'bar', 'foo2', 'bar2', 'foo3', 'bar3', 'foo4', 'bar4']
        });
    });

    it('should prune unnecessary disjunction expressions', function() {
        const input = {
            or: ['foo', 'bar', {
                or: ['baz', 'foo2']
            }]
        };

        expect(prune(input)).to.eql({
            or: ['foo', 'bar', 'baz', 'foo2']
        });
    });

    it('should prune unnecessary disjunction expressions (deeply nested example)', function() {
        const input = {
            or: [{
                or: [{
                    or: ['foo', 'bar']
                }, {
                    or: ['foo2', 'bar2']
                }]
            }, {
                or: [{
                    or: ['foo3', 'bar3']
                }, {
                    or: ['foo4', 'bar4']
                }]
            }]
        };

        expect(prune(input)).to.eql({
            or: ['foo', 'bar', 'foo2', 'bar2', 'foo3', 'bar3', 'foo4', 'bar4']
        });
    });

    it('should prune mixed conjunction and disjunction expressions', function() {
        const input = {
            and: [{
                or: [{
                    and: [{
                        and: ['foo', 'bar']
                    }, {
                        and: ['foo2', 'bar2']
                    }]
                }, {
                    or: ['foo3', 'bar4']
                }]
            }, 'foo4']
        };

        expect(prune(input)).to.eql({
            and: [{
                or: [{
                    and: ['foo', 'bar', 'foo2', 'bar2']
                }, 'foo3', 'bar4']
            }, 'foo4']
        });
    });

    it('should prune negation expressions', function() {
        const input = {
            not: {
                or: ['foo', 'bar', {
                    or: ['baz', 'foo2']
                }]
            }
        };

        expect(prune(input)).to.eql({
            not: {
                or: ['foo', 'bar', 'baz', 'foo2']
            }
        });
    });

    it('should remove duplicates from a conjunction', function() {
        const input = {
            and: ['foo', 'foo', 'bar']
        };

        expect(prune(input)).to.eql({
            and: ['foo', 'bar']
        });
    });

    it('should remove duplicates from a disjunction', function() {
        const input = {
            or: ['foo', 'foo', 'bar']
        };

        expect(prune(input)).to.eql({
            or: ['foo', 'bar']
        });
    });

    it('should remove duplicates from different conjunction groups', function() {
        const input = {
            and: ['foo', 'bar', {
                and: ['foo', 'baz']
            }]
        };

        expect(prune(input)).to.eql({
            and: ['foo', 'bar', 'baz']
        });
    });

    it('should remove duplicates from different disjunction groups', function() {
        const input = {
            or: ['foo', 'bar', {
                or: ['foo', 'baz']
            }]
        };

        expect(prune(input)).to.eql({
            or: ['foo', 'bar', 'baz']
        });
    });

});
