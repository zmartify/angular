import { ListWrapper } from "angular2/src/facade/collection";
export class AST {
    visit(visitor) { return null; }
    toString() { return "AST"; }
}
/**
 * Represents a quoted expression of the form:
 *
 * quote = prefix `:` uninterpretedExpression
 * prefix = identifier
 * uninterpretedExpression = arbitrary string
 *
 * A quoted expression is meant to be pre-processed by an AST transformer that
 * converts it into another AST that no longer contains quoted expressions.
 * It is meant to allow third-party developers to extend Angular template
 * expression language. The `uninterpretedExpression` part of the quote is
 * therefore not interpreted by the Angular's own expression parser.
 */
export class Quote extends AST {
    constructor(prefix, uninterpretedExpression, location) {
        super();
        this.prefix = prefix;
        this.uninterpretedExpression = uninterpretedExpression;
        this.location = location;
    }
    visit(visitor) { return visitor.visitQuote(this); }
    toString() { return "Quote"; }
}
export class EmptyExpr extends AST {
    visit(visitor) {
        // do nothing
    }
}
export class ImplicitReceiver extends AST {
    visit(visitor) { return visitor.visitImplicitReceiver(this); }
}
/**
 * Multiple expressions separated by a semicolon.
 */
export class Chain extends AST {
    constructor(expressions) {
        super();
        this.expressions = expressions;
    }
    visit(visitor) { return visitor.visitChain(this); }
}
export class Conditional extends AST {
    constructor(condition, trueExp, falseExp) {
        super();
        this.condition = condition;
        this.trueExp = trueExp;
        this.falseExp = falseExp;
    }
    visit(visitor) { return visitor.visitConditional(this); }
}
export class PropertyRead extends AST {
    constructor(receiver, name, getter) {
        super();
        this.receiver = receiver;
        this.name = name;
        this.getter = getter;
    }
    visit(visitor) { return visitor.visitPropertyRead(this); }
}
export class PropertyWrite extends AST {
    constructor(receiver, name, setter, value) {
        super();
        this.receiver = receiver;
        this.name = name;
        this.setter = setter;
        this.value = value;
    }
    visit(visitor) { return visitor.visitPropertyWrite(this); }
}
export class SafePropertyRead extends AST {
    constructor(receiver, name, getter) {
        super();
        this.receiver = receiver;
        this.name = name;
        this.getter = getter;
    }
    visit(visitor) { return visitor.visitSafePropertyRead(this); }
}
export class KeyedRead extends AST {
    constructor(obj, key) {
        super();
        this.obj = obj;
        this.key = key;
    }
    visit(visitor) { return visitor.visitKeyedRead(this); }
}
export class KeyedWrite extends AST {
    constructor(obj, key, value) {
        super();
        this.obj = obj;
        this.key = key;
        this.value = value;
    }
    visit(visitor) { return visitor.visitKeyedWrite(this); }
}
export class BindingPipe extends AST {
    constructor(exp, name, args) {
        super();
        this.exp = exp;
        this.name = name;
        this.args = args;
    }
    visit(visitor) { return visitor.visitPipe(this); }
}
export class LiteralPrimitive extends AST {
    constructor(value) {
        super();
        this.value = value;
    }
    visit(visitor) { return visitor.visitLiteralPrimitive(this); }
}
export class LiteralArray extends AST {
    constructor(expressions) {
        super();
        this.expressions = expressions;
    }
    visit(visitor) { return visitor.visitLiteralArray(this); }
}
export class LiteralMap extends AST {
    constructor(keys, values) {
        super();
        this.keys = keys;
        this.values = values;
    }
    visit(visitor) { return visitor.visitLiteralMap(this); }
}
export class Interpolation extends AST {
    constructor(strings, expressions) {
        super();
        this.strings = strings;
        this.expressions = expressions;
    }
    visit(visitor) { return visitor.visitInterpolation(this); }
}
export class Binary extends AST {
    constructor(operation, left, right) {
        super();
        this.operation = operation;
        this.left = left;
        this.right = right;
    }
    visit(visitor) { return visitor.visitBinary(this); }
}
export class PrefixNot extends AST {
    constructor(expression) {
        super();
        this.expression = expression;
    }
    visit(visitor) { return visitor.visitPrefixNot(this); }
}
export class MethodCall extends AST {
    constructor(receiver, name, fn, args) {
        super();
        this.receiver = receiver;
        this.name = name;
        this.fn = fn;
        this.args = args;
    }
    visit(visitor) { return visitor.visitMethodCall(this); }
}
export class SafeMethodCall extends AST {
    constructor(receiver, name, fn, args) {
        super();
        this.receiver = receiver;
        this.name = name;
        this.fn = fn;
        this.args = args;
    }
    visit(visitor) { return visitor.visitSafeMethodCall(this); }
}
export class FunctionCall extends AST {
    constructor(target, args) {
        super();
        this.target = target;
        this.args = args;
    }
    visit(visitor) { return visitor.visitFunctionCall(this); }
}
export class ASTWithSource extends AST {
    constructor(ast, source, location) {
        super();
        this.ast = ast;
        this.source = source;
        this.location = location;
    }
    visit(visitor) { return this.ast.visit(visitor); }
    toString() { return `${this.source} in ${this.location}`; }
}
export class TemplateBinding {
    constructor(key, keyIsVar, name, expression) {
        this.key = key;
        this.keyIsVar = keyIsVar;
        this.name = name;
        this.expression = expression;
    }
}
export class RecursiveAstVisitor {
    visitBinary(ast) {
        ast.left.visit(this);
        ast.right.visit(this);
        return null;
    }
    visitChain(ast) { return this.visitAll(ast.expressions); }
    visitConditional(ast) {
        ast.condition.visit(this);
        ast.trueExp.visit(this);
        ast.falseExp.visit(this);
        return null;
    }
    visitPipe(ast) {
        ast.exp.visit(this);
        this.visitAll(ast.args);
        return null;
    }
    visitFunctionCall(ast) {
        ast.target.visit(this);
        this.visitAll(ast.args);
        return null;
    }
    visitImplicitReceiver(ast) { return null; }
    visitInterpolation(ast) { return this.visitAll(ast.expressions); }
    visitKeyedRead(ast) {
        ast.obj.visit(this);
        ast.key.visit(this);
        return null;
    }
    visitKeyedWrite(ast) {
        ast.obj.visit(this);
        ast.key.visit(this);
        ast.value.visit(this);
        return null;
    }
    visitLiteralArray(ast) { return this.visitAll(ast.expressions); }
    visitLiteralMap(ast) { return this.visitAll(ast.values); }
    visitLiteralPrimitive(ast) { return null; }
    visitMethodCall(ast) {
        ast.receiver.visit(this);
        return this.visitAll(ast.args);
    }
    visitPrefixNot(ast) {
        ast.expression.visit(this);
        return null;
    }
    visitPropertyRead(ast) {
        ast.receiver.visit(this);
        return null;
    }
    visitPropertyWrite(ast) {
        ast.receiver.visit(this);
        ast.value.visit(this);
        return null;
    }
    visitSafePropertyRead(ast) {
        ast.receiver.visit(this);
        return null;
    }
    visitSafeMethodCall(ast) {
        ast.receiver.visit(this);
        return this.visitAll(ast.args);
    }
    visitAll(asts) {
        asts.forEach(ast => ast.visit(this));
        return null;
    }
    visitQuote(ast) { return null; }
}
export class AstTransformer {
    visitImplicitReceiver(ast) { return ast; }
    visitInterpolation(ast) {
        return new Interpolation(ast.strings, this.visitAll(ast.expressions));
    }
    visitLiteralPrimitive(ast) { return new LiteralPrimitive(ast.value); }
    visitPropertyRead(ast) {
        return new PropertyRead(ast.receiver.visit(this), ast.name, ast.getter);
    }
    visitPropertyWrite(ast) {
        return new PropertyWrite(ast.receiver.visit(this), ast.name, ast.setter, ast.value);
    }
    visitSafePropertyRead(ast) {
        return new SafePropertyRead(ast.receiver.visit(this), ast.name, ast.getter);
    }
    visitMethodCall(ast) {
        return new MethodCall(ast.receiver.visit(this), ast.name, ast.fn, this.visitAll(ast.args));
    }
    visitSafeMethodCall(ast) {
        return new SafeMethodCall(ast.receiver.visit(this), ast.name, ast.fn, this.visitAll(ast.args));
    }
    visitFunctionCall(ast) {
        return new FunctionCall(ast.target.visit(this), this.visitAll(ast.args));
    }
    visitLiteralArray(ast) {
        return new LiteralArray(this.visitAll(ast.expressions));
    }
    visitLiteralMap(ast) {
        return new LiteralMap(ast.keys, this.visitAll(ast.values));
    }
    visitBinary(ast) {
        return new Binary(ast.operation, ast.left.visit(this), ast.right.visit(this));
    }
    visitPrefixNot(ast) { return new PrefixNot(ast.expression.visit(this)); }
    visitConditional(ast) {
        return new Conditional(ast.condition.visit(this), ast.trueExp.visit(this), ast.falseExp.visit(this));
    }
    visitPipe(ast) {
        return new BindingPipe(ast.exp.visit(this), ast.name, this.visitAll(ast.args));
    }
    visitKeyedRead(ast) {
        return new KeyedRead(ast.obj.visit(this), ast.key.visit(this));
    }
    visitKeyedWrite(ast) {
        return new KeyedWrite(ast.obj.visit(this), ast.key.visit(this), ast.value.visit(this));
    }
    visitAll(asts) {
        var res = ListWrapper.createFixedSize(asts.length);
        for (var i = 0; i < asts.length; ++i) {
            res[i] = asts[i].visit(this);
        }
        return res;
    }
    visitChain(ast) { return new Chain(this.visitAll(ast.expressions)); }
    visitQuote(ast) {
        return new Quote(ast.prefix, ast.uninterpretedExpression, ast.location);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC0zZTZPUXJ0aC50bXAvYW5ndWxhcjIvc3JjL2NvcmUvY2hhbmdlX2RldGVjdGlvbi9wYXJzZXIvYXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sZ0NBQWdDO0FBRTFEO0lBQ0UsS0FBSyxDQUFDLE9BQW1CLElBQVMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDaEQsUUFBUSxLQUFhLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCwyQkFBMkIsR0FBRztJQUM1QixZQUFtQixNQUFjLEVBQVMsdUJBQStCLEVBQVMsUUFBYTtRQUM3RixPQUFPLENBQUM7UUFEUyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVMsNEJBQXVCLEdBQXZCLHVCQUF1QixDQUFRO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBSztJQUUvRixDQUFDO0lBQ0QsS0FBSyxDQUFDLE9BQW1CLElBQVMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLFFBQVEsS0FBYSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUN4QyxDQUFDO0FBRUQsK0JBQStCLEdBQUc7SUFDaEMsS0FBSyxDQUFDLE9BQW1CO1FBQ3ZCLGFBQWE7SUFDZixDQUFDO0FBQ0gsQ0FBQztBQUVELHNDQUFzQyxHQUFHO0lBQ3ZDLEtBQUssQ0FBQyxPQUFtQixJQUFTLE1BQU0sQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pGLENBQUM7QUFFRDs7R0FFRztBQUNILDJCQUEyQixHQUFHO0lBQzVCLFlBQW1CLFdBQWtCO1FBQUksT0FBTyxDQUFDO1FBQTlC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Q0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWpGLFVBQVUsQ0FBQyxHQUFVO1FBQ25CLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDMUUsQ0FBQztBQUNILENBQUM7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TGlzdFdyYXBwZXJ9IGZyb20gXCJhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb25cIjtcblxuZXhwb3J0IGNsYXNzIEFTVCB7XG4gIHZpc2l0KHZpc2l0b3I6IEFzdFZpc2l0b3IpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxuICB0b1N0cmluZygpOiBzdHJpbmcgeyByZXR1cm4gXCJBU1RcIjsgfVxufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBxdW90ZWQgZXhwcmVzc2lvbiBvZiB0aGUgZm9ybTpcbiAqXG4gKiBxdW90ZSA9IHByZWZpeCBgOmAgdW5pbnRlcnByZXRlZEV4cHJlc3Npb25cbiAqIHByZWZpeCA9IGlkZW50aWZpZXJcbiAqIHVuaW50ZXJwcmV0ZWRFeHByZXNzaW9uID0gYXJiaXRyYXJ5IHN0cmluZ1xuICpcbiAqIEEgcXVvdGVkIGV4cHJlc3Npb24gaXMgbWVhbnQgdG8gYmUgcHJlLXByb2Nlc3NlZCBieSBhbiBBU1QgdHJhbnNmb3JtZXIgdGhhdFxuICogY29udmVydHMgaXQgaW50byBhbm90aGVyIEFTVCB0aGF0IG5vIGxvbmdlciBjb250YWlucyBxdW90ZWQgZXhwcmVzc2lvbnMuXG4gKiBJdCBpcyBtZWFudCB0byBhbGxvdyB0aGlyZC1wYXJ0eSBkZXZlbG9wZXJzIHRvIGV4dGVuZCBBbmd1bGFyIHRlbXBsYXRlXG4gKiBleHByZXNzaW9uIGxhbmd1YWdlLiBUaGUgYHVuaW50ZXJwcmV0ZWRFeHByZXNzaW9uYCBwYXJ0IG9mIHRoZSBxdW90ZSBpc1xuICogdGhlcmVmb3JlIG5vdCBpbnRlcnByZXRlZCBieSB0aGUgQW5ndWxhcidzIG93biBleHByZXNzaW9uIHBhcnNlci5cbiAqL1xuZXhwb3J0IGNsYXNzIFF1b3RlIGV4dGVuZHMgQVNUIHtcbiAgY29uc3RydWN0b3IocHVibGljIHByZWZpeDogc3RyaW5nLCBwdWJsaWMgdW5pbnRlcnByZXRlZEV4cHJlc3Npb246IHN0cmluZywgcHVibGljIGxvY2F0aW9uOiBhbnkpIHtcbiAgICBzdXBlcigpO1xuICB9XG4gIHZpc2l0KHZpc2l0b3I6IEFzdFZpc2l0b3IpOiBhbnkgeyByZXR1cm4gdmlzaXRvci52aXNpdFF1b3RlKHRoaXMpOyB9XG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7IHJldHVybiBcIlF1b3RlXCI7IH1cbn1cblxuZXhwb3J0IGNsYXNzIEVtcHR5RXhwciBleHRlbmRzIEFTVCB7XG4gIHZpc2l0KHZpc2l0b3I6IEFzdFZpc2l0b3IpIHtcbiAgICAvLyBkbyBub3RoaW5nXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEltcGxpY2l0UmVjZWl2ZXIgZXh0ZW5kcyBBU1Qge1xuICB2aXNpdCh2aXNpdG9yOiBBc3RWaXNpdG9yKTogYW55IHsgcmV0dXJuIHZpc2l0b3IudmlzaXRJbXBsaWNpdFJlY2VpdmVyKHRoaXMpOyB9XG59XG5cbi8qKlxuICogTXVsdGlwbGUgZXhwcmVzc2lvbnMgc2VwYXJhdGVkIGJ5IGEgc2VtaWNvbG9uLlxuICovXG5leHBvcnQgY2xhc3MgQ2hhaW4gZXh0ZW5kcyBBU1Qge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZXhwcmVzc2lvbnM6IGFueVtdKSB7IHN1cGVyKCk7IH1cbiAgdmlzaXQodmlzaXRvcjogQXN0VmlzaXRvcik6IGFueSB7IHJldHVybiB2aXNpdG9yLnZpc2l0Q2hhaW4odGhpcyk7IH1cbn1cblxuZXhwb3J0IGNsYXNzIENvbmRpdGlvbmFsIGV4dGVuZHMgQVNUIHtcbiAgY29uc3RydWN0b3IocHVibGljIGNvbmRpdGlvbjogQVNULCBwdWJsaWMgdHJ1ZUV4cDogQVNULCBwdWJsaWMgZmFsc2VFeHA6IEFTVCkgeyBzdXBlcigpOyB9XG4gIHZpc2l0KHZpc2l0b3I6IEFzdFZpc2l0b3IpOiBhbnkgeyByZXR1cm4gdmlzaXRvci52aXNpdENvbmRpdGlvbmFsKHRoaXMpOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBQcm9wZXJ0eVJlYWQgZXh0ZW5kcyBBU1Qge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVjZWl2ZXI6IEFTVCwgcHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIGdldHRlcjogRnVuY3Rpb24pIHsgc3VwZXIoKTsgfVxuICB2aXNpdCh2aXNpdG9yOiBBc3RWaXNpdG9yKTogYW55IHsgcmV0dXJuIHZpc2l0b3IudmlzaXRQcm9wZXJ0eVJlYWQodGhpcyk7IH1cbn1cblxuZXhwb3J0IGNsYXNzIFByb3BlcnR5V3JpdGUgZXh0ZW5kcyBBU1Qge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVjZWl2ZXI6IEFTVCwgcHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIHNldHRlcjogRnVuY3Rpb24sXG4gICAgICAgICAgICAgIHB1YmxpYyB2YWx1ZTogQVNUKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuICB2aXNpdCh2aXNpdG9yOiBBc3RWaXNpdG9yKTogYW55IHsgcmV0dXJuIHZpc2l0b3IudmlzaXRQcm9wZXJ0eVdyaXRlKHRoaXMpOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBTYWZlUHJvcGVydHlSZWFkIGV4dGVuZHMgQVNUIHtcbiAgY29uc3RydWN0b3IocHVibGljIHJlY2VpdmVyOiBBU1QsIHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyBnZXR0ZXI6IEZ1bmN0aW9uKSB7IHN1cGVyKCk7IH1cbiAgdmlzaXQodmlzaXRvcjogQXN0VmlzaXRvcik6IGFueSB7IHJldHVybiB2aXNpdG9yLnZpc2l0U2FmZVByb3BlcnR5UmVhZCh0aGlzKTsgfVxufVxuXG5leHBvcnQgY2xhc3MgS2V5ZWRSZWFkIGV4dGVuZHMgQVNUIHtcbiAgY29uc3RydWN0b3IocHVibGljIG9iajogQVNULCBwdWJsaWMga2V5OiBBU1QpIHsgc3VwZXIoKTsgfVxuICB2aXNpdCh2aXNpdG9yOiBBc3RWaXNpdG9yKTogYW55IHsgcmV0dXJuIHZpc2l0b3IudmlzaXRLZXllZFJlYWQodGhpcyk7IH1cbn1cblxuZXhwb3J0IGNsYXNzIEtleWVkV3JpdGUgZXh0ZW5kcyBBU1Qge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgb2JqOiBBU1QsIHB1YmxpYyBrZXk6IEFTVCwgcHVibGljIHZhbHVlOiBBU1QpIHsgc3VwZXIoKTsgfVxuICB2aXNpdCh2aXNpdG9yOiBBc3RWaXNpdG9yKTogYW55IHsgcmV0dXJuIHZpc2l0b3IudmlzaXRLZXllZFdyaXRlKHRoaXMpOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBCaW5kaW5nUGlwZSBleHRlbmRzIEFTVCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBleHA6IEFTVCwgcHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIGFyZ3M6IGFueVtdKSB7IHN1cGVyKCk7IH1cbiAgdmlzaXQodmlzaXRvcjogQXN0VmlzaXRvcik6IGFueSB7IHJldHVybiB2aXNpdG9yLnZpc2l0UGlwZSh0aGlzKTsgfVxufVxuXG5leHBvcnQgY2xhc3MgTGl0ZXJhbFByaW1pdGl2ZSBleHRlbmRzIEFTVCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZSkgeyBzdXBlcigpOyB9XG4gIHZpc2l0KHZpc2l0b3I6IEFzdFZpc2l0b3IpOiBhbnkgeyByZXR1cm4gdmlzaXRvci52aXNpdExpdGVyYWxQcmltaXRpdmUodGhpcyk7IH1cbn1cblxuZXhwb3J0IGNsYXNzIExpdGVyYWxBcnJheSBleHRlbmRzIEFTVCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBleHByZXNzaW9uczogYW55W10pIHsgc3VwZXIoKTsgfVxuICB2aXNpdCh2aXNpdG9yOiBBc3RWaXNpdG9yKTogYW55IHsgcmV0dXJuIHZpc2l0b3IudmlzaXRMaXRlcmFsQXJyYXkodGhpcyk7IH1cbn1cblxuZXhwb3J0IGNsYXNzIExpdGVyYWxNYXAgZXh0ZW5kcyBBU1Qge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMga2V5czogYW55W10sIHB1YmxpYyB2YWx1ZXM6IGFueVtdKSB7IHN1cGVyKCk7IH1cbiAgdmlzaXQodmlzaXRvcjogQXN0VmlzaXRvcik6IGFueSB7IHJldHVybiB2aXNpdG9yLnZpc2l0TGl0ZXJhbE1hcCh0aGlzKTsgfVxufVxuXG5leHBvcnQgY2xhc3MgSW50ZXJwb2xhdGlvbiBleHRlbmRzIEFTVCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzdHJpbmdzOiBhbnlbXSwgcHVibGljIGV4cHJlc3Npb25zOiBhbnlbXSkgeyBzdXBlcigpOyB9XG4gIHZpc2l0KHZpc2l0b3I6IEFzdFZpc2l0b3IpOiBhbnkgeyByZXR1cm4gdmlzaXRvci52aXNpdEludGVycG9sYXRpb24odGhpcyk7IH1cbn1cblxuZXhwb3J0IGNsYXNzIEJpbmFyeSBleHRlbmRzIEFTVCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBvcGVyYXRpb246IHN0cmluZywgcHVibGljIGxlZnQ6IEFTVCwgcHVibGljIHJpZ2h0OiBBU1QpIHsgc3VwZXIoKTsgfVxuICB2aXNpdCh2aXNpdG9yOiBBc3RWaXNpdG9yKTogYW55IHsgcmV0dXJuIHZpc2l0b3IudmlzaXRCaW5hcnkodGhpcyk7IH1cbn1cblxuZXhwb3J0IGNsYXNzIFByZWZpeE5vdCBleHRlbmRzIEFTVCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBleHByZXNzaW9uOiBBU1QpIHsgc3VwZXIoKTsgfVxuICB2aXNpdCh2aXNpdG9yOiBBc3RWaXNpdG9yKTogYW55IHsgcmV0dXJuIHZpc2l0b3IudmlzaXRQcmVmaXhOb3QodGhpcyk7IH1cbn1cblxuZXhwb3J0IGNsYXNzIE1ldGhvZENhbGwgZXh0ZW5kcyBBU1Qge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVjZWl2ZXI6IEFTVCwgcHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIGZuOiBGdW5jdGlvbiwgcHVibGljIGFyZ3M6IGFueVtdKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuICB2aXNpdCh2aXNpdG9yOiBBc3RWaXNpdG9yKTogYW55IHsgcmV0dXJuIHZpc2l0b3IudmlzaXRNZXRob2RDYWxsKHRoaXMpOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBTYWZlTWV0aG9kQ2FsbCBleHRlbmRzIEFTVCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWNlaXZlcjogQVNULCBwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgZm46IEZ1bmN0aW9uLCBwdWJsaWMgYXJnczogYW55W10pIHtcbiAgICBzdXBlcigpO1xuICB9XG4gIHZpc2l0KHZpc2l0b3I6IEFzdFZpc2l0b3IpOiBhbnkgeyByZXR1cm4gdmlzaXRvci52aXNpdFNhZmVNZXRob2RDYWxsKHRoaXMpOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBGdW5jdGlvbkNhbGwgZXh0ZW5kcyBBU1Qge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGFyZ2V0OiBBU1QsIHB1YmxpYyBhcmdzOiBhbnlbXSkgeyBzdXBlcigpOyB9XG4gIHZpc2l0KHZpc2l0b3I6IEFzdFZpc2l0b3IpOiBhbnkgeyByZXR1cm4gdmlzaXRvci52aXNpdEZ1bmN0aW9uQ2FsbCh0aGlzKTsgfVxufVxuXG5leHBvcnQgY2xhc3MgQVNUV2l0aFNvdXJjZSBleHRlbmRzIEFTVCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBhc3Q6IEFTVCwgcHVibGljIHNvdXJjZTogc3RyaW5nLCBwdWJsaWMgbG9jYXRpb246IHN0cmluZykgeyBzdXBlcigpOyB9XG4gIHZpc2l0KHZpc2l0b3I6IEFzdFZpc2l0b3IpOiBhbnkgeyByZXR1cm4gdGhpcy5hc3QudmlzaXQodmlzaXRvcik7IH1cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHsgcmV0dXJuIGAke3RoaXMuc291cmNlfSBpbiAke3RoaXMubG9jYXRpb259YDsgfVxufVxuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVCaW5kaW5nIHtcbiAgY29uc3RydWN0b3IocHVibGljIGtleTogc3RyaW5nLCBwdWJsaWMga2V5SXNWYXI6IGJvb2xlYW4sIHB1YmxpYyBuYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgIHB1YmxpYyBleHByZXNzaW9uOiBBU1RXaXRoU291cmNlKSB7fVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFzdFZpc2l0b3Ige1xuICB2aXNpdEJpbmFyeShhc3Q6IEJpbmFyeSk6IGFueTtcbiAgdmlzaXRDaGFpbihhc3Q6IENoYWluKTogYW55O1xuICB2aXNpdENvbmRpdGlvbmFsKGFzdDogQ29uZGl0aW9uYWwpOiBhbnk7XG4gIHZpc2l0RnVuY3Rpb25DYWxsKGFzdDogRnVuY3Rpb25DYWxsKTogYW55O1xuICB2aXNpdEltcGxpY2l0UmVjZWl2ZXIoYXN0OiBJbXBsaWNpdFJlY2VpdmVyKTogYW55O1xuICB2aXNpdEludGVycG9sYXRpb24oYXN0OiBJbnRlcnBvbGF0aW9uKTogYW55O1xuICB2aXNpdEtleWVkUmVhZChhc3Q6IEtleWVkUmVhZCk6IGFueTtcbiAgdmlzaXRLZXllZFdyaXRlKGFzdDogS2V5ZWRXcml0ZSk6IGFueTtcbiAgdmlzaXRMaXRlcmFsQXJyYXkoYXN0OiBMaXRlcmFsQXJyYXkpOiBhbnk7XG4gIHZpc2l0TGl0ZXJhbE1hcChhc3Q6IExpdGVyYWxNYXApOiBhbnk7XG4gIHZpc2l0TGl0ZXJhbFByaW1pdGl2ZShhc3Q6IExpdGVyYWxQcmltaXRpdmUpOiBhbnk7XG4gIHZpc2l0TWV0aG9kQ2FsbChhc3Q6IE1ldGhvZENhbGwpOiBhbnk7XG4gIHZpc2l0UGlwZShhc3Q6IEJpbmRpbmdQaXBlKTogYW55O1xuICB2aXNpdFByZWZpeE5vdChhc3Q6IFByZWZpeE5vdCk6IGFueTtcbiAgdmlzaXRQcm9wZXJ0eVJlYWQoYXN0OiBQcm9wZXJ0eVJlYWQpOiBhbnk7XG4gIHZpc2l0UHJvcGVydHlXcml0ZShhc3Q6IFByb3BlcnR5V3JpdGUpOiBhbnk7XG4gIHZpc2l0UXVvdGUoYXN0OiBRdW90ZSk6IGFueTtcbiAgdmlzaXRTYWZlTWV0aG9kQ2FsbChhc3Q6IFNhZmVNZXRob2RDYWxsKTogYW55O1xuICB2aXNpdFNhZmVQcm9wZXJ0eVJlYWQoYXN0OiBTYWZlUHJvcGVydHlSZWFkKTogYW55O1xufVxuXG5leHBvcnQgY2xhc3MgUmVjdXJzaXZlQXN0VmlzaXRvciBpbXBsZW1lbnRzIEFzdFZpc2l0b3Ige1xuICB2aXNpdEJpbmFyeShhc3Q6IEJpbmFyeSk6IGFueSB7XG4gICAgYXN0LmxlZnQudmlzaXQodGhpcyk7XG4gICAgYXN0LnJpZ2h0LnZpc2l0KHRoaXMpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0Q2hhaW4oYXN0OiBDaGFpbik6IGFueSB7IHJldHVybiB0aGlzLnZpc2l0QWxsKGFzdC5leHByZXNzaW9ucyk7IH1cbiAgdmlzaXRDb25kaXRpb25hbChhc3Q6IENvbmRpdGlvbmFsKTogYW55IHtcbiAgICBhc3QuY29uZGl0aW9uLnZpc2l0KHRoaXMpO1xuICAgIGFzdC50cnVlRXhwLnZpc2l0KHRoaXMpO1xuICAgIGFzdC5mYWxzZUV4cC52aXNpdCh0aGlzKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdFBpcGUoYXN0OiBCaW5kaW5nUGlwZSk6IGFueSB7XG4gICAgYXN0LmV4cC52aXNpdCh0aGlzKTtcbiAgICB0aGlzLnZpc2l0QWxsKGFzdC5hcmdzKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdEZ1bmN0aW9uQ2FsbChhc3Q6IEZ1bmN0aW9uQ2FsbCk6IGFueSB7XG4gICAgYXN0LnRhcmdldC52aXNpdCh0aGlzKTtcbiAgICB0aGlzLnZpc2l0QWxsKGFzdC5hcmdzKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdEltcGxpY2l0UmVjZWl2ZXIoYXN0OiBJbXBsaWNpdFJlY2VpdmVyKTogYW55IHsgcmV0dXJuIG51bGw7IH1cbiAgdmlzaXRJbnRlcnBvbGF0aW9uKGFzdDogSW50ZXJwb2xhdGlvbik6IGFueSB7IHJldHVybiB0aGlzLnZpc2l0QWxsKGFzdC5leHByZXNzaW9ucyk7IH1cbiAgdmlzaXRLZXllZFJlYWQoYXN0OiBLZXllZFJlYWQpOiBhbnkge1xuICAgIGFzdC5vYmoudmlzaXQodGhpcyk7XG4gICAgYXN0LmtleS52aXNpdCh0aGlzKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdEtleWVkV3JpdGUoYXN0OiBLZXllZFdyaXRlKTogYW55IHtcbiAgICBhc3Qub2JqLnZpc2l0KHRoaXMpO1xuICAgIGFzdC5rZXkudmlzaXQodGhpcyk7XG4gICAgYXN0LnZhbHVlLnZpc2l0KHRoaXMpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0TGl0ZXJhbEFycmF5KGFzdDogTGl0ZXJhbEFycmF5KTogYW55IHsgcmV0dXJuIHRoaXMudmlzaXRBbGwoYXN0LmV4cHJlc3Npb25zKTsgfVxuICB2aXNpdExpdGVyYWxNYXAoYXN0OiBMaXRlcmFsTWFwKTogYW55IHsgcmV0dXJuIHRoaXMudmlzaXRBbGwoYXN0LnZhbHVlcyk7IH1cbiAgdmlzaXRMaXRlcmFsUHJpbWl0aXZlKGFzdDogTGl0ZXJhbFByaW1pdGl2ZSk6IGFueSB7IHJldHVybiBudWxsOyB9XG4gIHZpc2l0TWV0aG9kQ2FsbChhc3Q6IE1ldGhvZENhbGwpOiBhbnkge1xuICAgIGFzdC5yZWNlaXZlci52aXNpdCh0aGlzKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdEFsbChhc3QuYXJncyk7XG4gIH1cbiAgdmlzaXRQcmVmaXhOb3QoYXN0OiBQcmVmaXhOb3QpOiBhbnkge1xuICAgIGFzdC5leHByZXNzaW9uLnZpc2l0KHRoaXMpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0UHJvcGVydHlSZWFkKGFzdDogUHJvcGVydHlSZWFkKTogYW55IHtcbiAgICBhc3QucmVjZWl2ZXIudmlzaXQodGhpcyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXRQcm9wZXJ0eVdyaXRlKGFzdDogUHJvcGVydHlXcml0ZSk6IGFueSB7XG4gICAgYXN0LnJlY2VpdmVyLnZpc2l0KHRoaXMpO1xuICAgIGFzdC52YWx1ZS52aXNpdCh0aGlzKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdFNhZmVQcm9wZXJ0eVJlYWQoYXN0OiBTYWZlUHJvcGVydHlSZWFkKTogYW55IHtcbiAgICBhc3QucmVjZWl2ZXIudmlzaXQodGhpcyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXRTYWZlTWV0aG9kQ2FsbChhc3Q6IFNhZmVNZXRob2RDYWxsKTogYW55IHtcbiAgICBhc3QucmVjZWl2ZXIudmlzaXQodGhpcyk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRBbGwoYXN0LmFyZ3MpO1xuICB9XG4gIHZpc2l0QWxsKGFzdHM6IEFTVFtdKTogYW55IHtcbiAgICBhc3RzLmZvckVhY2goYXN0ID0+IGFzdC52aXNpdCh0aGlzKSk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXRRdW90ZShhc3Q6IFF1b3RlKTogYW55IHsgcmV0dXJuIG51bGw7IH1cbn1cblxuZXhwb3J0IGNsYXNzIEFzdFRyYW5zZm9ybWVyIGltcGxlbWVudHMgQXN0VmlzaXRvciB7XG4gIHZpc2l0SW1wbGljaXRSZWNlaXZlcihhc3Q6IEltcGxpY2l0UmVjZWl2ZXIpOiBBU1QgeyByZXR1cm4gYXN0OyB9XG5cbiAgdmlzaXRJbnRlcnBvbGF0aW9uKGFzdDogSW50ZXJwb2xhdGlvbik6IEFTVCB7XG4gICAgcmV0dXJuIG5ldyBJbnRlcnBvbGF0aW9uKGFzdC5zdHJpbmdzLCB0aGlzLnZpc2l0QWxsKGFzdC5leHByZXNzaW9ucykpO1xuICB9XG5cbiAgdmlzaXRMaXRlcmFsUHJpbWl0aXZlKGFzdDogTGl0ZXJhbFByaW1pdGl2ZSk6IEFTVCB7IHJldHVybiBuZXcgTGl0ZXJhbFByaW1pdGl2ZShhc3QudmFsdWUpOyB9XG5cbiAgdmlzaXRQcm9wZXJ0eVJlYWQoYXN0OiBQcm9wZXJ0eVJlYWQpOiBBU1Qge1xuICAgIHJldHVybiBuZXcgUHJvcGVydHlSZWFkKGFzdC5yZWNlaXZlci52aXNpdCh0aGlzKSwgYXN0Lm5hbWUsIGFzdC5nZXR0ZXIpO1xuICB9XG5cbiAgdmlzaXRQcm9wZXJ0eVdyaXRlKGFzdDogUHJvcGVydHlXcml0ZSk6IEFTVCB7XG4gICAgcmV0dXJuIG5ldyBQcm9wZXJ0eVdyaXRlKGFzdC5yZWNlaXZlci52aXNpdCh0aGlzKSwgYXN0Lm5hbWUsIGFzdC5zZXR0ZXIsIGFzdC52YWx1ZSk7XG4gIH1cblxuICB2aXNpdFNhZmVQcm9wZXJ0eVJlYWQoYXN0OiBTYWZlUHJvcGVydHlSZWFkKTogQVNUIHtcbiAgICByZXR1cm4gbmV3IFNhZmVQcm9wZXJ0eVJlYWQoYXN0LnJlY2VpdmVyLnZpc2l0KHRoaXMpLCBhc3QubmFtZSwgYXN0LmdldHRlcik7XG4gIH1cblxuICB2aXNpdE1ldGhvZENhbGwoYXN0OiBNZXRob2RDYWxsKTogQVNUIHtcbiAgICByZXR1cm4gbmV3IE1ldGhvZENhbGwoYXN0LnJlY2VpdmVyLnZpc2l0KHRoaXMpLCBhc3QubmFtZSwgYXN0LmZuLCB0aGlzLnZpc2l0QWxsKGFzdC5hcmdzKSk7XG4gIH1cblxuICB2aXNpdFNhZmVNZXRob2RDYWxsKGFzdDogU2FmZU1ldGhvZENhbGwpOiBBU1Qge1xuICAgIHJldHVybiBuZXcgU2FmZU1ldGhvZENhbGwoYXN0LnJlY2VpdmVyLnZpc2l0KHRoaXMpLCBhc3QubmFtZSwgYXN0LmZuLCB0aGlzLnZpc2l0QWxsKGFzdC5hcmdzKSk7XG4gIH1cblxuICB2aXNpdEZ1bmN0aW9uQ2FsbChhc3Q6IEZ1bmN0aW9uQ2FsbCk6IEFTVCB7XG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbkNhbGwoYXN0LnRhcmdldC52aXNpdCh0aGlzKSwgdGhpcy52aXNpdEFsbChhc3QuYXJncykpO1xuICB9XG5cbiAgdmlzaXRMaXRlcmFsQXJyYXkoYXN0OiBMaXRlcmFsQXJyYXkpOiBBU1Qge1xuICAgIHJldHVybiBuZXcgTGl0ZXJhbEFycmF5KHRoaXMudmlzaXRBbGwoYXN0LmV4cHJlc3Npb25zKSk7XG4gIH1cblxuICB2aXNpdExpdGVyYWxNYXAoYXN0OiBMaXRlcmFsTWFwKTogQVNUIHtcbiAgICByZXR1cm4gbmV3IExpdGVyYWxNYXAoYXN0LmtleXMsIHRoaXMudmlzaXRBbGwoYXN0LnZhbHVlcykpO1xuICB9XG5cbiAgdmlzaXRCaW5hcnkoYXN0OiBCaW5hcnkpOiBBU1Qge1xuICAgIHJldHVybiBuZXcgQmluYXJ5KGFzdC5vcGVyYXRpb24sIGFzdC5sZWZ0LnZpc2l0KHRoaXMpLCBhc3QucmlnaHQudmlzaXQodGhpcykpO1xuICB9XG5cbiAgdmlzaXRQcmVmaXhOb3QoYXN0OiBQcmVmaXhOb3QpOiBBU1QgeyByZXR1cm4gbmV3IFByZWZpeE5vdChhc3QuZXhwcmVzc2lvbi52aXNpdCh0aGlzKSk7IH1cblxuICB2aXNpdENvbmRpdGlvbmFsKGFzdDogQ29uZGl0aW9uYWwpOiBBU1Qge1xuICAgIHJldHVybiBuZXcgQ29uZGl0aW9uYWwoYXN0LmNvbmRpdGlvbi52aXNpdCh0aGlzKSwgYXN0LnRydWVFeHAudmlzaXQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBhc3QuZmFsc2VFeHAudmlzaXQodGhpcykpO1xuICB9XG5cbiAgdmlzaXRQaXBlKGFzdDogQmluZGluZ1BpcGUpOiBBU1Qge1xuICAgIHJldHVybiBuZXcgQmluZGluZ1BpcGUoYXN0LmV4cC52aXNpdCh0aGlzKSwgYXN0Lm5hbWUsIHRoaXMudmlzaXRBbGwoYXN0LmFyZ3MpKTtcbiAgfVxuXG4gIHZpc2l0S2V5ZWRSZWFkKGFzdDogS2V5ZWRSZWFkKTogQVNUIHtcbiAgICByZXR1cm4gbmV3IEtleWVkUmVhZChhc3Qub2JqLnZpc2l0KHRoaXMpLCBhc3Qua2V5LnZpc2l0KHRoaXMpKTtcbiAgfVxuXG4gIHZpc2l0S2V5ZWRXcml0ZShhc3Q6IEtleWVkV3JpdGUpOiBBU1Qge1xuICAgIHJldHVybiBuZXcgS2V5ZWRXcml0ZShhc3Qub2JqLnZpc2l0KHRoaXMpLCBhc3Qua2V5LnZpc2l0KHRoaXMpLCBhc3QudmFsdWUudmlzaXQodGhpcykpO1xuICB9XG5cbiAgdmlzaXRBbGwoYXN0czogYW55W10pOiBhbnlbXSB7XG4gICAgdmFyIHJlcyA9IExpc3RXcmFwcGVyLmNyZWF0ZUZpeGVkU2l6ZShhc3RzLmxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhc3RzLmxlbmd0aDsgKytpKSB7XG4gICAgICByZXNbaV0gPSBhc3RzW2ldLnZpc2l0KHRoaXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgdmlzaXRDaGFpbihhc3Q6IENoYWluKTogQVNUIHsgcmV0dXJuIG5ldyBDaGFpbih0aGlzLnZpc2l0QWxsKGFzdC5leHByZXNzaW9ucykpOyB9XG5cbiAgdmlzaXRRdW90ZShhc3Q6IFF1b3RlKTogQVNUIHtcbiAgICByZXR1cm4gbmV3IFF1b3RlKGFzdC5wcmVmaXgsIGFzdC51bmludGVycHJldGVkRXhwcmVzc2lvbiwgYXN0LmxvY2F0aW9uKTtcbiAgfVxufVxuIl19