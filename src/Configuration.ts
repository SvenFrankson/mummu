namespace Mummu {

    export enum ConfigurationElementType {
        Boolean,
        Number,
        Enum
    }

    export class ConfigurationElement {

        constructor(
            public property: string,
            public type: ConfigurationElementType,
            public value: number,
            public onChange?: () => void
        ) {

        }
    }

    export abstract class Configuration {

        public configurationElements: ConfigurationElement[] = [];

        constructor(public configName: string) {

        }

        public initialize(): void {
            this._buildElementsArray();
            let data = JSON.parse(localStorage.getItem(this.configName));
            this.deserialize(data);
        }

        protected abstract _buildElementsArray(): void;

        public saveToLocalStorage(): void {
            let data = this.serialize();
            localStorage.setItem(this.configName, JSON.stringify(data));
        }

        public serialize(): any {
            let data = {};

            this.configurationElements.forEach(configurationElement => {
                data[configurationElement.property] = configurationElement.value;
            });

            return data;
        }

        public deserialize(data: any): void {
            if (data) {
                this.configurationElements.forEach(configurationElement => {
                    let v = data[configurationElement.property];
                    if (v != undefined) {
                        configurationElement.value = v;
                    }
                })
            }
        }
    }
}