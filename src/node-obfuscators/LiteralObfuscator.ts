import * as escodegen from 'escodegen';

import { ILiteralNode } from "../interfaces/nodes/ILiteralNode";
import { INode } from "../interfaces/nodes/INode";

import { AbstractNodeObfuscator } from './AbstractNodeObfuscator';
import { BooleanLiteralReplacer } from "./replacers/BooleanLiteralReplacer";
import { Nodes } from "../Nodes";
import { NumberLiteralReplacer } from "./replacers/NumberLiteralReplacer";
import { StringLiteralReplacer } from "./replacers/StringLiteralReplacer";

export class LiteralObfuscator extends AbstractNodeObfuscator {
    /**
     * @param literalNode
     * @param parentNode
     */
    public obfuscateNode (literalNode: ILiteralNode, parentNode: INode): void {
        if (Nodes.isPropertyNode(parentNode) && parentNode.key === literalNode) {
            return;
        }

        if (literalNode['x-verbatim-property']) {
            return;
        }

        let content: string;

        switch (typeof literalNode.value) {
            case 'boolean':
                content = new BooleanLiteralReplacer(this.nodes, this.options)
                    .replace(<boolean>literalNode.value);

                break;

            case 'number':
                content = new NumberLiteralReplacer(this.nodes, this.options)
                    .replace(<number>literalNode.value);

                break;


            case 'string':
                content = new StringLiteralReplacer(this.nodes, this.options)
                        .replace(<string>literalNode.value);

                break;

            default:
                return;
        }

        literalNode['x-verbatim-property'] = {
            content : content,
            precedence: escodegen.Precedence.Primary
        };
    }
}
