// To parse this data:
//
//   import { Convert, ServerData } from "./file";
//
//   const serverData = Convert.toServerData(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface apiServerResponse {
    ip:           string;
    port:         number;
    debug:        Debug;
    motd:         MOTD;
    players:      Players;
    version:      string;
    online:       boolean;
    protocol:     Protocol;
    hostname:     string;
    software:     string;
    eula_blocked: boolean;
}

export interface Debug {
    ping:          boolean;
    query:         boolean;
    srv:           boolean;
    querymismatch: boolean;
    ipinsrv:       boolean;
    cnameinsrv:    boolean;
    animatedmotd:  boolean;
    cachehit:      boolean;
    cachetime:     number;
    cacheexpire:   number;
    apiversion:    number;
    dns:           DNS;
    error:         Error;
}

export interface DNS {
    a: A[];
}

export interface A {
    name:     string;
    type:     string;
    class:    string;
    ttl:      number;
    rdlength: number;
    rdata:    string;
    address:  string;
}

export interface Error {
    query: string;
}

export interface MOTD {
    raw:   string[];
    clean: string[];
    html:  string[];
}

export interface Players {
    online: number;
    max:    number;
    list:   List[];
}

export interface List {
    name: string;
    uuid: string;
}

export interface Protocol {
    version: number;
    name:    string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toServerData(json: string): ServerData {
        return cast(JSON.parse(json), r("ServerData"));
    }

    public static serverDataToJson(value: ServerData): string {
        return JSON.stringify(uncast(value, r("ServerData")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "ServerData": o([
        { json: "ip", js: "ip", typ: "" },
        { json: "port", js: "port", typ: 0 },
        { json: "debug", js: "debug", typ: r("Debug") },
        { json: "motd", js: "motd", typ: r("MOTD") },
        { json: "players", js: "players", typ: r("Players") },
        { json: "version", js: "version", typ: "" },
        { json: "online", js: "online", typ: true },
        { json: "protocol", js: "protocol", typ: r("Protocol") },
        { json: "hostname", js: "hostname", typ: "" },
        { json: "software", js: "software", typ: "" },
        { json: "eula_blocked", js: "eula_blocked", typ: true },
    ], false),
    "Debug": o([
        { json: "ping", js: "ping", typ: true },
        { json: "query", js: "query", typ: true },
        { json: "srv", js: "srv", typ: true },
        { json: "querymismatch", js: "querymismatch", typ: true },
        { json: "ipinsrv", js: "ipinsrv", typ: true },
        { json: "cnameinsrv", js: "cnameinsrv", typ: true },
        { json: "animatedmotd", js: "animatedmotd", typ: true },
        { json: "cachehit", js: "cachehit", typ: true },
        { json: "cachetime", js: "cachetime", typ: 0 },
        { json: "cacheexpire", js: "cacheexpire", typ: 0 },
        { json: "apiversion", js: "apiversion", typ: 0 },
        { json: "dns", js: "dns", typ: r("DNS") },
        { json: "error", js: "error", typ: r("Error") },
    ], false),
    "DNS": o([
        { json: "a", js: "a", typ: a(r("A")) },
    ], false),
    "A": o([
        { json: "name", js: "name", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "class", js: "class", typ: "" },
        { json: "ttl", js: "ttl", typ: 0 },
        { json: "rdlength", js: "rdlength", typ: 0 },
        { json: "rdata", js: "rdata", typ: "" },
        { json: "address", js: "address", typ: "" },
    ], false),
    "Error": o([
        { json: "query", js: "query", typ: "" },
    ], false),
    "MOTD": o([
        { json: "raw", js: "raw", typ: a("") },
        { json: "clean", js: "clean", typ: a("") },
        { json: "html", js: "html", typ: a("") },
    ], false),
    "Players": o([
        { json: "online", js: "online", typ: 0 },
        { json: "max", js: "max", typ: 0 },
        { json: "list", js: "list", typ: a(r("List")) },
    ], false),
    "List": o([
        { json: "name", js: "name", typ: "" },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "Protocol": o([
        { json: "version", js: "version", typ: 0 },
        { json: "name", js: "name", typ: "" },
    ], false),
};
