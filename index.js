'use strict';

const { uniqWith, isEqual } = require('lodash');

function pruneExpression(expression) {
    if (typeof expression === 'string') {
        return expression;
    } else if ('not' in expression) {
        expression.not = pruneExpression(expression.not);
        return expression;
    } else if ('and' in expression) {
        for (let i = 0; i < expression.and.length; i++) {
            const andExpression = expression.and[i];
            if (typeof andExpression === 'object' && 'and' in andExpression) {
                // Remove the nested 'and' expression and insert its contents
                expression.and.splice(i, 1, ...andExpression.and);
                i--; // bump counter back since we just inserted more items w/ the splice
            } else {
                expression.and[i] = pruneExpression(andExpression);
            }
        }

        expression.and = uniqWith(expression.and, isEqual);

        return expression;
    } else if ('or' in expression) {
        for (let i = 0; i < expression.or.length; i++) {
            const orExpression = expression.or[i];
            if (typeof orExpression === 'object' && 'or' in orExpression) {
                // Remove the nested 'or' expression and insert its contents
                expression.or.splice(i, 1, ...orExpression.or);
                // bump counter back since we just inserted more items w/ the splice
                i--;
            } else {
                expression.or[i] = pruneExpression(orExpression);
            }
        }

        expression.or = uniqWith(expression.or, isEqual);

        return expression;
    }
}

module.exports = pruneExpression;
