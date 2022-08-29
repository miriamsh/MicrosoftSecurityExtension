"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatesProvider = void 0;
const vscode = require("vscode");
const kubesec_gate_1 = require("./gates/kubesec/kubesec-gate");
const gatesList = require("./gates/gateList.json");
const template_gate_1 = require("./gates/template-analyzer/template-gate");
class GatesProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        const configuredView = vscode.workspace.getConfiguration().get('microsoft.security.gate.gates.activity.settings');
        const gates_activity_settings = Object.assign({}, configuredView);
        this.gates = [new kubesec_gate_1.KubesecGate(gates_activity_settings["kubesec"]),
            new template_gate_1.TemplateAnalyzerGate(gates_activity_settings["templateAnalyzer"])];
        //
        this.loadGates();
    }
    loadGates() {
        gatesList.forEach((gate) => {
            Promise.resolve().then(() => require(gate.path)).then((x) => {
                this.gates.push(new x[gate.name]());
            });
        });
    }
    ;
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        return element === undefined ?
            Promise.resolve(this.gates) :
            element.getMoreChildren(this);
    }
    activeAllGates() {
        this.gates.forEach((gate) => { return gate.activate(); });
        this.refresh();
    }
    refresh(treeItem) {
        treeItem ?
            this._onDidChangeTreeData.fire(treeItem) :
            this._onDidChangeTreeData.fire();
    }
}
exports.GatesProvider = GatesProvider;
//# sourceMappingURL=gate-provider.js.map