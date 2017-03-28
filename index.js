'use strict';

const { uniqWith, isEqual, intersection } = require('lodash');

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
            } else if (typeof andExpression === 'object' && 'or' in andExpression) {
                // Check if there are any common variables between the base group and any nested "or" groups
                const variablesInGroup = expression.and.filter(item => typeof item === 'string');
                if (intersection(variablesInGroup, andExpression.or).length > 0) {
                    // Remove the nested 'or' expression as it is redundant
                    expression.and.splice(i, 1);
                    i--; // bump counter back since we just removed an element
                } else {
                    expression.and[i] = pruneExpression(andExpression);
                }
            } else {
                expression.and[i] = pruneExpression(andExpression);
            }
        }

        expression.and = uniqWith(expression.and, isEqual);

        // If there is only one element left after deduplication, just return that
        if (expression.and.length === 1) {
            return expression.and[0];
        }

        return expression;
    } else if ('or' in expression) {
        for (let i = 0; i < expression.or.length; i++) {
            const orExpression = expression.or[i];
            if (typeof orExpression === 'object' && 'or' in orExpression) {
                // Remove the nested 'or' expression and insert its contents
                expression.or.splice(i, 1, ...orExpression.or);
                // bump counter back since we just inserted more items w/ the splice
                i--;
            } else if (typeof orExpression === 'object' && 'and' in orExpression) {
                // Check if there are any common variables between the base group and any nested "and" groups
                const variablesInGroup = expression.or.filter(item => typeof item === 'string');
                if (intersection(variablesInGroup, orExpression.and).length > 0) {
                    // Remove the nested 'or' expression as it is redundant
                    expression.or.splice(i, 1);
                    i--; // bump counter back since we just removed an element
                } else {
                    expression.or[i] = pruneExpression(orExpression);
                }
            } else {
                expression.or[i] = pruneExpression(orExpression);
            }
        }

        expression.or = uniqWith(expression.or, isEqual);

        // If there is only one element left after deduplication, just return that
        if (expression.or.length === 1) {
            return expression.or[0];
        }

        return expression;
    }
}

module.exports = pruneExpression;
