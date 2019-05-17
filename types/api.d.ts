declare namespace TrueChartAPI {
    /** the place where the basic trueChart config is located */
    interface IConfigManager {
        getConfig: () => IConfig;
        setConfig: (config: IConfig) => void;
        setDocumentMode: (mode: TDocumentMode) => void;
    }
    type TDocumentMode = 'DESIGN' | 'PRESENTATION';
    type TBIType = 'sense' | 'core' | 'powerbi';
    /** Settings Interface */
    interface IConfig {
        /** the place or folder where the document is located. on a website it is window.location.pathname */
        documentLocation: string;
        /** the name of the document/app, on a website it is the title of document */
        documentTitle: string;
        /** the name of the document/app, on a website it is the title of document */
        documentName: string;
        /** function that returns the serverId, in normal use-cases it can be the name of the trueChart instance */
        getServerId: (sourceObject: ISourceObject) => string;
        /** user-object with username and displayname */
        user: {
            username: string;
            displayname?: string;
        };
        /** global variable for biSystem information. needed within templating-feature */
        biSystem?: TBIType;
    }
    type TBIMode = 'none' | 'edit';
    /** supported languages of trueChart */
    type TLanguage = 'de_DE' | 'en_US';
    /** user roles of a user */
    type TUserRole = 'Designer' | 'NotationManual' | 'Consumer';
    interface INotationManual {
        parameters: Map<string, string>;
        dataTypes: Map<string, IDataTypeDefinitions>;
    }
    interface IDataTypeDefinitions {
        abbr: string;
        subTypes: Map<string, ISubTypeDefinition>;
    }
    interface ISubTypeDefinition {
        name: string;
        settings: Map<string, string>;
    }
    interface ICustomAction {
        name: string;
        label: ITranslationText | string;
        description: ITranslationText | string;
        parameters: TCustomActionParameters[];
        handler: Function;
    }
    interface ITranslationText {
        de: string;
        en: string;
    }
    interface ISourceObject {
        element: Element;
    }
    type TCustomActionParameters = 'none' | 'additional' | 'bookmarkId' | 'custom' | 'dimensionName' | 'fieldName' | 'fieldValue' | 'fieldValues' | 'initial' | 'keep' | 'lockedAlso' | 'measureName' | 'mashupOnly' | 'qMode' | 'qPartial' | 'senseVariable' | 'sheetId' | 'softLock' | 'storyId' | 'toggle' | 'trueChartExtension' | 'url' | 'urlTarget' | 'variableContent' | 'fullScreenExpression';
}
declare namespace TrueChartAPI {
    type TDimensionTypes = 'date' | 'text';
    type TDataType = 'number' | 'comment' | 'list' | 'flag';
    interface IDataColumn {
        name: string;
        sourceReference?: unknown;
    }
    interface IDimension extends IDataColumn {
        type: TDimensionTypes;
    }
    interface IMeasure extends IDataColumn {
        type: TDataType;
    }
    interface IMeasureComment extends IIdentifiableMeasure {
        /** do not use common table when undefined */
        commonTableId?: string;
    }
    interface IMeasureList extends IIdentifiableMeasure {
        listContent: {
            description: string;
            key: string;
        }[];
    }
    type TAggregatorType = 'others' | 'rests' | 'totals';
    /** DataSource interface */
    interface IDataSource extends IDataModelBaseAsync {
        /**
         * Call this to mark the beginning of multiple changes to the datasource. Between beginUpdate() and endUpdate() no checks and repaint-triggers will
         * be processed
         */
        beginUpdate(): void;
        /**
         * Call this to mark the end of multiple changes.
         */
        endUpdate(): void;
        /**
         * adds a aggregator row to the data source
         * @param {TrueChartAPI.TAggregatorType} type - type of the aggregator row
         * @param {number} rowIndex - position where the data row should be insert
         */
        markAggregatorRow(type: TAggregatorType, rowIndex: number): void;
        /**
         * Adds a dimension to the context. TrueChart will be repainted on successful adding.
         * @param {TrueChartAPI.IDimension} newDimension
         * @param {string[]} data Initial data of the new dimension. If there is already data in this context, the length of this array must be the same as
         * the existing data.
         * @returns {string} internal ID of the dimension for reference
         */
        addDimension(newDimension: IDimension, data: string[]): string;
        /**
         * Renames an existing dimension and repaint on success
         * @param dimensionId ID of the dimension to be renamed
         * @param newName new name of the dimension
         * @returns true if succeeded
         */
        renameDimension(dimensionId: string, newName: string): boolean;
        /**
         * Removes a formerly added dimension. TrueChart will be repainted on successful removing.
         * @param {string} dimensionId ID of the dimension to be deleted
         * @returns {boolean} True when succeeded
         */
        removeDimension(dimensionId: string): boolean;
        /**
         * Returns information about all dimensions in this context. This can be used to display header information for tables.
         * @returns {{id: string, name: string, type: TrueChartAPI.TDimensionTypes}[]}
         */
        listDimensions(): (IDimension & {
            id: string;
        })[];
        /**
         * Adds a measure to the context. TrueChart will be repainted on successful adding.
         * @param {TrueChartAPI.TMeasure} newMeasure
         * @param {TrueChartAPI.TDataValue[]} data Initial data of the new measure. If there is already data in this context, the length of this array must
         * be the same as the existing data.
         * @returns {string} internal ID of the measure for reference
         */
        addMeasure(newMeasure: IMeasure | IMeasureComment | IMeasureList, data: TDataValue[]): string;
        /**
         * Renames an existing measure and repaint on success
         * @param measureId ID of the measure to be renamed
         * @param newName new name of the measure
         * @returns true if succeeded
         */
        renameMeasure(measureId: string, newName: string): boolean;
        /**
         * Removes a formerly added measure. TrueChart will be repainted on successful removing.
         * @param {string} measureId ID of the measure to be deleted
         * @returns {boolean} True when succeeded
         */
        removeMeasure(measureId: string): boolean;
        /**
         * Returns information about all measures in this context. This can be used to display header information for tables.
         * @returns {{id: string, name: string, type: TrueChartAPI.TDataType}[]}
         */
        listMeasures(): (IMeasure & {
            id: string;
        })[];
        /**
         * Changes existing data points
         * @param {{[id: string]: TrueChartAPI.TDataValue[]}} columns
         * @returns {boolean} True when succeeded
         */
        changeData(columns: {
            [id: string]: TrueChartAPI.TDataValue[];
        }): boolean;
        /**
         * Adds row(s) to the dataset. TrueChart will be repainted on successful adding.
         * @param {TrueChartAPI.TDataValue[] | TrueChartAPI.TDataValue[][]} row Data points of 1 single row or multiple rows. The data of each row must be
         * <dimension[0]>..<dimension<n-1>, <measure[0]>..<measure[m-1]>. The order of dimensions and measures is the same as returned from
         * listDimensions() and listMeasures()
         * @returns {boolean} True when succeeded.
         */
        addDataRow(row: TrueChartAPI.TDataValue[] | TrueChartAPI.TDataValue[][]): boolean;
        Comments?: IComment[];
    }
    /**
     * this is the base of the dataSources what need to be parsed into trueChart
     */
    interface IDataModelBase {
        Id: string;
        /**
         * The name of the context as it will be displayed to the user.
         * Changing the name will trigger a TrueChart repaint
         */
        Name: string;
        /**
         * Optional external reference, to help managing the connection between the BI and trueChart
         */
        SourceReference?: unknown;
        /**
         * Map of aggregators,
         * the number needs to be the index of the aggregator row
         */
        readonly Aggregator?: {
            [key: string]: number[];
        };
        /**
         * Access to the raw data
         * Returns data-rows where each row is a datapoint in the order: <dimension[0]>..<dimension<n-1>, <measure[0]>..<measure[m-1]>.
         * The order of dimensions and measures is the same as returned from listDimensions() and listMeasures()
         */
        readonly Data: TDataValue[][];
        /** List of dimensions */
        readonly Dimensions: IDimension[];
        /** List of measures */
        readonly Measures: IMeasure[];
    }
    /**
     * this is the async data source
     */
    interface IDataModelBaseAsync extends IDataModelBase {
        readonly Dimensions: IIdentifiableDimension[];
        readonly Measures: IIdentifiableMeasure[];
    }
    /** a dimension with an id */
    interface IIdentifiableDimension extends IIdentifiable, IDimension {
    }
    /** a measure wit an id */
    interface IIdentifiableMeasure extends IIdentifiable, IMeasure {
    }
    /** something which need to be identifiable for trueChart, please take care that this id is unique */
    interface IIdentifiable {
        id: string;
    }
    /** names identifiable object */
    interface IIdentifiableObject extends IIdentifiable {
        name: string;
    }
}
declare namespace TrueChartAPI {
    interface IError extends Error {
        code: string;
    }
    /**
     * is thrown when an api function call is not available right now
     */
    interface IAccessDeniedError extends IError {
        /** equals ACCESS_DENIED */
        code: string;
    }
    /**
     * is thrown when given file is not readable
     */
    interface IFileNotReadeableError {
        /** equals FILE_NOT_READABLE */
        code: string;
    }
    /**
     * is thrown when a invalid data was insert into the API
     */
    interface IInvalidDataError extends IError {
        /** equals INVALID_DATA */
        code: string;
    }
    /**
     * is thrown when a invalid feature is registered
     */
    interface IInvalidFeatureError extends IError {
        /** starts with INVALID_FEATURE */
        code: string;
    }
    /**
     * is thrown when calling an API function with wrong parameters
     */
    interface IInvalidParameterError extends IError {
        /** equals INVALID_PARAMETER */
        code: string;
    }
    /**
     * is thrown when something very bad and unexpected happens in trueChart
     */
    interface IRuntimeError extends IError {
        /** equals RUNTIME_ERROR */
        code: string;
    }
    /**
     * is thrown when method call is unsupported
     */
    interface IUnsupportedMethodCall extends IError {
        /** equals UNSUPPORTED_METHOD_CALL */
        code: string;
    }
}
declare namespace TrueChartAPI {
    /** Formula expression of a specific type */
    interface IExpression<T = TExpressionType> {
        /** Expression formula as a string. */
        formula: string;
        /** Expression type as a string */
        type: T;
    }
    /** Interface of a trueChart expression */
    interface ITrueChartExpression extends IExpression<'tc' | 'core'> {
        /** Context id of a context which has to be used for calculation */
        contextId?: string;
        /** Expression mode which defines how the expression has to be evaluated */
        mode?: TExpressionMode;
    }
    /** Possible expression types */
    type TExpression = IExpression | ITrueChartExpression;
    /** Expression type */
    type TExpressionType = 'tc' | 'sense' | 'core' | 'powerbi' | 'js';
    /** Expression mode which defines how the expression has to be evaluated */
    type TExpressionMode = 'evaluate' | 'resolve';
}
declare namespace TrueChartAPI {
    type TTemplate = IParsedTemplate<ICellContainer>;
    /** template which is parsed needed to be supported */
    interface IParsedTemplate<T> extends ITemplate<T> {
        unsupportedVersion?: boolean;
        unsupportedSystem?: boolean;
    }
    /** template that can be applied by trueChart */
    interface ITemplate<T> {
        data: {
            /** layout definition of the cell container */
            content: T;
            /** version of the layout definition the content was created */
            contentVersion: number;
            /** definition of the trueChart-templating data context */
            dataContexts: ITemplate.IDataContext[];
            /** definition of the trueChart-templating variables */
            variables: ITemplate.IVariable[];
            /** definition of the trueChart-templating common tables */
            commonTables: ITemplate.ICommonTable[];
            /** definition of the trueChart-templating comments */
            comments: ITemplate.ICommentGrid[];
        };
        meta: ITemplate.IMeta;
    }
    /** the trueChart template object */
    namespace ITemplate {
        /** meta definition of the template */
        interface IMeta extends ITemplate.ITagable {
            /** id of the template */
            id: string | number;
            /** author of the template */
            author: string;
            /** true, when the actual user can edit the template, the user needs to have designer rights to update */
            canUpdate: boolean;
            /** datetime when the user has created the template */
            date: string;
            /** datetime when the user did the last modification */
            lastModifiedAt: string;
            /** a custom description of the template */
            description: string;
            /** title of the template */
            title: string;
            /** base64 image string */
            thumbnail: string;
            /** true, when a template is accessible */
            isPublic: boolean;
            /** true, when its a base template that can't be edited */
            isBaseTemplate: boolean;
            /** the trueChart-Version of the template */
            tcversion: string;
            /** the version of the template */
            modelversion: string;
            /** the BI system the template was originally stored with */
            supportinfo: 'sense' | 'powerbi';
            /** Owner of the template on service side */
            readonly user?: {
                author: string;
                id: number;
            };
        }
        /** definition of a template variable */
        interface IVariable extends ISourceData<string> {
        }
        interface IDataContext {
            /** id of the data context */
            id: string;
            /** id of the data context */
            contextId: string;
            /** name of the data context */
            name: string;
            /** dimensions of the template context */
            dimensions: IDimension[];
            /** measures of the template context */
            measures: IMeasure[];
        }
        /** template dimension */
        interface IDimension extends ISourceData<IExpression> {
        }
        /** template measure */
        interface IMeasure extends ISourceData<IExpression> {
        }
        /** template common table */
        interface ICommonTable extends ICommonData {
            /** key of the common table */
            key: string;
            /** additional information to the common table */
            additionInformation: string;
        }
        /** Comments model */
        interface ICommentGrid {
            /** Comment id of the object */
            id: string;
            /** Comments with different condition values */
            comments: IComment[];
        }
        /** Comment grid of the comments model */
        interface IComment {
            /** Comment rows of the grid */
            grid: ICommentRow[];
            /** Condition Value of the comment grid */
            conditionValue: string;
        }
        /** Comment columns content of the grid */
        interface ICommentColumn {
            /** Chart in which the comment was created */
            created_in_chart: string;
            /** Id of the comment */
            id: string;
            /** Last modified date */
            lastModified: string;
            /** Last user who modified the comment */
            lastModifiedBy: string;
            /** References of the comment */
            reference: ICommentReference[];
            /** Text of the comment */
            text: string;
            /** Current version of the comment */
            version: number;
        }
        /** Reference model for comment references */
        interface ICommentReference {
            /** State of the reference */
            active: boolean;
            /** Chart id of the reference */
            chartId: string;
            /** Element path */
            elementPath: string;
            /** Element type */
            elementType: string;
            /** Extension hash of the extension in which the reference is used */
            extension: string;
            /** Id of the reference */
            id: number;
            /** Position Object which describes the reference circle */
            position: {
                /** x position */
                x: number;
                /** y position */
                y: number;
                /** Radius of the reference circle */
                radius: number;
            };
            /** Reference id */
            refId: string;
            /** Current version of the reference */
            version: number;
        }
        /** Comment columns of the grid */
        type ICommentRow = ICommentColumn[];
        /** data map of a template, it maps the template definition to the actual data context */
        namespace IDataMap {
            /** map of the data context, e.g. {idOfTheTemplateObject: idOfTheActualContext} */
            interface IDataContexts {
                [id: string]: IValidatable & {
                    /** context id of the new context */
                    id: string;
                    /** name of the context */
                    name: string;
                    /** map of the dimension */
                    dimensions: IDataContextDimensions;
                    /** map of the measures */
                    measures: IDataContextMeasures;
                };
            }
            /** map of the dimensions */
            interface IDataContextDimensions {
                [id: string]: TDimension;
            }
            /** map of the measures */
            interface IDataContextMeasures {
                [id: string]: TMeasure;
            }
            /** map of the variables */
            interface IVariables {
                [name: string]: TVariable;
            }
            /** map of the common tables */
            interface ICommonTables {
                [key: string]: ICommonData & IValidatable & {
                    /** key of the common table */
                    key: string;
                    /** password of the common table */
                    password: string;
                    /** reapeated password of the common table */
                    repeatedPassword: string;
                    /** additional information of the common table */
                    additionInformation: string;
                };
            }
            /** defines a template target data object */
            interface ITargetData<T = string | IExpression, S = TSource> extends ISourceData<T>, IValidatable {
                /** source of the target data */
                source?: S;
            }
            /** error object on the data map, it is not a real javascript error */
            interface IDataMapError {
                /** name of the error */
                name: string;
                /** error code of the data map error */
                code: string;
                /** the error message */
                message: string;
                /** severity of the error, 0 means no error, 1 means info level, 2 means warning level, 3 means error */
                level: 0 | 1 | 2 | 3;
            }
            interface IValidatable {
                /** true when the user confirmed that appending the template even with error */
                checked?: boolean;
                /** represents the validation state */
                error?: IDataMapError;
            }
            /** Dimension DataMap object */
            type TDimension = ITargetData<IExpression, TDimensionSource>;
            /** Measure DataMap object */
            type TMeasure = ITargetData<IExpression, TMeasureSource>;
            /** Variable DataMap object */
            type TVariable = ITargetData<string, TVariableSource>;
            /** all possible sources */
            type TSource = TDimensionSource | TMeasureSource | TVariableSource;
            /** possible sources for dimensions and measures */
            type TDataSource = 'datacontext' | 'fields';
            /** possible sources for dimensions */
            type TDimensionSource = TDataSource | 'dimensions';
            /** possible sources for measures */
            type TMeasureSource = TDataSource | 'measures' | 'internal';
            /** possible sources for variables */
            type TVariableSource = 'variables';
        }
        /** complete data map object */
        interface IDataMap {
            dataContexts: IDataMap.IDataContexts;
            variables: IDataMap.IVariables;
            commonTables: IDataMap.ICommonTables;
        }
        /** defines a template source data object */
        interface ISourceData<T = string | IExpression> extends ICommonData, ITagable {
            /** name of the data */
            name: T;
            /** definition of the data */
            definition: IExpression;
        }
        /** defines a template common data object */
        interface ICommonData {
            /** id of the data */
            id: string;
            /** description of the data */
            description: string;
        }
        /** defines a tagable object */
        interface ITagable {
            tags: string[];
        }
    }
}
declare namespace TrueChartAPI {
    /** Interface of the main trueChart class */
    interface ITrueChart {
        /** shows the trueChart component */
        show(): void;
        /** element where trueChart paints into */
        readonly Element: HTMLElement;
        /** returns the DataManager instance */
        readonly DataManager: IDataManager;
        /** returns the EventsManager instance */
        readonly EventsManager: IEventsManager;
        /** returns the FeatureManager instance */
        readonly FeatureManager: IFeatureManager;
        /** a Promise which will be resolved, when trueChart is completely initialized */
        readonly Initialized: Promise<void>;
        /** returns the LayoutManager instance */
        readonly LayoutManager: ILayoutManager;
        /** returns the TemplateManager instance */
        readonly TemplateManager: ITemplateManager;
        /**
         * register an callback that evaluates if on extension is active
         * use this to 'deregister' a trueChart instance when it is not visible on the actual sheet
         * @param cb - function that returns the state or boolean
         */
        setIsActive(cb: boolean | (() => boolean)): void;
        /**
         * evaluates the registered callback returns the value
         * @return the active state
         */
        getIsActive(): boolean;
        /**
         * register an callback that evaluates if on extension is hidden
         * tell trueChart that is located on a sheet but currently not displayed
         * @param cb - function that returns the state or boolean
         */
        setIsHidden(cb: boolean | (() => boolean)): void;
        /**
         * evaluates the registered callback returns the value
         * @return the active state
         */
        getIsHidden(): boolean;
        /** reinitializes the instance */
        reinitialize(): Promise<void>;
    }
}
declare namespace TrueChartAPI {
    /** Interface definition of an UserInterface class */
    interface IUserInterface {
        /** This property returns the public name of the UserInterface */
        readonly Name: string;
        /**
         * Creates and returns an instance of "Example Dialog"
         * @param parent Parent HTML element where the dialog will be created
         * @returns Instance of the dialog
         */
        createExampleDialog(parent: HTMLElement): IDialog;
        createConfigDialog(parent: HTMLElement): IConfigDialog;
    }
    /** Interface definition of a Base Dialog class as part of an user interface */
    interface IDialog {
        /**
         * Shows the dialog
         * @param modal Show as modal
         */
        show(modal?: boolean): void;
        /**
         * Closes the dialog. Implementations should trigger OnClose.
         */
        close(): void;
        /**
         * OnClose callback. Calls a function with the dialog result as parameter.
         */
        OnClose: TVoidFunction<TDialogResult>;
    }
    interface IConfigDialog extends IDialog {
        Config: any;
        OnApply: (() => void);
    }
    /**
     * All possible results values when closing a dialog
     */
    type TDialogResult<T = void> = T | 'Cancel' | 'OK';
}
declare interface ITrueChartWindow extends Window {
    TrueChartCore_API: ITrueChartCoreAPI;
}
declare interface ITrueChartCoreAPI {
    /**
     * Returns an instance of trueChart
     * @param parent Parent HTML node for trueChart to paint into.
     * @param features Initial set of feature implementations
     * @returns trueChart instance object implementing ITrueChart API
     */
    createTrueChart: (parent: HTMLElement, features?: TrueChartAPI.IFeatureMap) => TrueChartAPI.ITrueChart;
    /**
     * Destroys a trueChart instance
     * @param instance Reference to the instance. Can be an ID (string), the parent HTML node or the instance itself
     */
    destroyTrueChart: (instance: string | HTMLElement | TrueChartAPI.ITrueChart) => void;
    /** Holds a global instance of the UserInterface Manager */
    UIManager: TrueChartAPI.IUserInterfaceManager;
    /** Holds a global instance of the Instance Manager */
    InstanceManager: TrueChartAPI.IInstanceManager;
    /** Holds a global instance of the Config Manager */
    ConfigManager: TrueChartAPI.IConfigManager;
    /** Holds an instance of the Global Feature Manager */
    GlobalFeatureManager: TrueChartAPI.IGlobalFeatureManager;
    /** Shows all created trueChart instances at once */
    showAll: () => void;
}
declare namespace TrueChartAPI {
    /** Action implementation interface */
    type TActionImplementation<P extends object = object, O extends {
        /** Type of the optional parameter */
        type: string;
        /** Action parameter object */
        params: object;
    } = {
        type: string;
        params: object;
    }> = (
    /** @param Required action parameters */
    params: P,
    /** @param Optional action parameters */
    optionalParams?: O[],
    /** @param Additional trigger info, depending on the used trigger */
    data?: IActionTriggerData) => Promise<void>;
    /** Additional data which will be provided in the execute callback depending on trigger */
    interface IActionTriggerData<T extends object = object> {
        /** Trigger event */
        event: ActionTriggerData.IEvent<T>;
        /** Element which was clicked (availability depends on a trigger type) */
        element?: HTMLElement;
        /** Additional information which will be provided when click action was performed on a chart based visualization */
        clickInfo?: ActionTriggerData.IClickInfo;
        /** Current selections which will be provided for on select trigger actions */
        selections?: ActionTriggerData.ISelection[];
    }
    namespace ActionTriggerData {
        type TTriggerType = 'click' | 'selection' | 'load' | 'beforeUnload' | 'custom';
        interface IEvent<T extends object = object> {
            /** Trigger type */
            type: TTriggerType;
            /** Target element/component */
            target: T;
            /** Name of the custom trigger (only available when type is 'custom' */
            name?: string;
            /** Data which the user can provide during the custom trigger execution */
            data?: unknown;
        }
        interface IClickInfo {
            /** Click position */
            position: {
                x: number;
                y: number;
            };
            /** Defined variable name of the first 'SetVariable' action */
            variableName: string;
            /** Defined variable value to be set of the first 'SetVariable' action */
            variableValue: string;
            /** Auto variable value, which is available only when the click was performed on a chart based visualization */
            variableValueAuto: string;
        }
        interface ISelection {
            /** Name of the selected data (field name) */
            fieldName?: string;
            /** Selected values of the selected data */
            selectedValues?: (string | number)[];
            /** Alternate state the selection belongs to (BI dependent) */
            alternateState?: string;
        }
    }
    /** Action parameters */
    namespace ActionParameter {
        /** Action parameter of the Custom action */
        type TCustomParameter = {
            /** Function body to execute */
            functionBody: string;
        };
        /** Action parameter of the GoToSheet action */
        type TGoToSheetParameter = {
            /** Id of the target sheet */
            sheetId: string;
        };
        /** Action parameter of the GoToStory action */
        type TGoToStoryParameter = {
            /** Id of the target story */
            storyId: string;
        };
        /** Action parameter of the GoToURL action */
        type TGoToURLParameter = {
            /** Target url */
            url: string;
            /** Target window (name) */
            target?: ActionParameter.TUrlTarget | string;
            /** If true, action must be performed only in Mashup */
            inMashupOnly?: boolean;
            /** If true, the given URL must be downloaded instead of opened */
            download?: boolean;
        };
        /** Action parameter of the GoToApp action */
        type TGoToAppParameter = TShareAppParameter & {
            /** Id of the target app */
            appId: string;
            /** Id of the target sheet */
            sheetId?: string;
            /** If true, selections will be cleared in the target app */
            clearSelections?: boolean;
            /** If true, current selections will be applied in the target app */
            useCurrentSelections?: boolean;
            /** Target of the GoToApp action */
            target?: TUrlTarget | TShareAppTarget | 'customWindowName';
            /** Custom window name when target is 'customWindowName' */
            windowName?: string;
        };
        /** Optional parameter of the GoToApp action */
        type TGoToAppOptionalParameter = {
            type: 'applyBookmark';
            params: TApplyBookmarkParameter;
        } | {
            type: 'selectValues';
            params: Pick<TSelectValuesParameter, 'fieldName' | 'values'>;
        };
        type TShareAppParameter = {
            /** Target of the ShareApp action */
            target?: ActionParameter.TShareAppTarget;
            /** Email address in combination with email target */
            emailAddress?: string;
            /** Email subject in combination with email target */
            emailSubject?: string;
            /** Email body in combination with email target */
            emailBody?: string;
            /** Placeholder of the generated link in combination with email target */
            linkPlaceholder?: string;
        };
        type TSetVariableParameter = {
            /** Name of the variable */
            name: string;
            /** Variable value to be set */
            value?: string;
            /** If true, variable value will be set only if variable has no current value */
            keepValue?: boolean;
        };
        type TSelectValuesParameter = TFieldParameter & {
            /** Semicolon separated values to be selected */
            values: string;
            /** If true, selection will be toggled */
            toggleSelection?: boolean;
            /** If true, selection will be performed only when the field has no selections already applied */
            initialSelection?: boolean;
            /** If true, selections will be applied additionally to current selections */
            additionalSelection?: boolean;
        };
        type TSelectMatchParameter = TFieldParameter & {
            /** Value to be selected */
            value: string;
            /** If true, selection will be performed only when the field has no selections already applied */
            initialSelection?: boolean;
        };
        type TClearAllFieldsParameter = Pick<TFieldParameter, 'softLock' | 'alternateState'>;
        type TLockAllFieldsParameter = Pick<TFieldParameter, 'alternateState'>;
        type TApplyBookmarkParameter = {
            /** Id of the bookmark to be applied */
            bookmarkId: string;
        };
        type TReloadDataParameter = {
            /** Mode of the data reload */
            mode?: string;
            /** If true, only a partial data reload will be performed */
            partial?: boolean;
        };
        type TToggleFullScreenParameter = {
            /** Condition of the ToggleFullScreen action (true -> enable fullscreen, false -> disable fullscreen, 'empty | undefined' -> toggle fullscreen */
            condition?: string;
        };
        /** Action parameter of "select" actions */
        type TFieldParameter = {
            /** Name of the field */
            fieldName: string;
            /** If true, locked fields will be treated as if they were not locked (only in Qlik Sense available) */
            softLock?: boolean;
            /** State of the field (only in Qlik Sense available) */
            alternateState?: string;
        };
        /** Target of the ShareApp action */
        type TShareAppTarget = 'email' | 'clipboard';
        /** Target of the GoToURL action */
        type TUrlTarget = '_blank' | '_self';
        /** Action parameter of the SetCellValue action */
        type TSetCellValueParameter = {
            /** Id of the target sheet */
            sheetId: string;
            /** cell address */
            address: string;
            /** new value to be set */
            value: string;
        };
    }
    /** Possible (supported) action implementations */
    interface IActionImplementations {
        /** No operation action */
        None: TActionImplementation;
        /** Perform custom javascript code */
        Custom: TActionImplementation<ActionParameter.TCustomParameter>;
        /** Navigates to next sheet (page if executed in mashup) */
        NextSheet: TActionImplementation;
        /** Navigates to previous sheet (page if executed in mashup) */
        PreviousSheet: TActionImplementation;
        /** Navigates to a specific sheet */
        GoToSheet: TActionImplementation<ActionParameter.TGoToSheetParameter>;
        /** Navigates to a specific story */
        GoToStory: TActionImplementation<ActionParameter.TGoToStoryParameter>;
        /** Navigates to a target URL */
        GoToURL: TActionImplementation<ActionParameter.TGoToURLParameter>;
        /** Navigates to a target APP */
        GoToApp: TActionImplementation<ActionParameter.TGoToAppParameter, ActionParameter.TGoToAppOptionalParameter>;
        /** Shares the current app by generating a target link and providing it in a clipboard or an email */
        ShareApp: TActionImplementation<ActionParameter.TShareAppParameter>;
        /** Assigns a value to a variable */
        SetVariable: TActionImplementation<ActionParameter.TSetVariableParameter>;
        /** Applies a specific bookmark (selections) */
        ApplyBookmark: TActionImplementation<ActionParameter.TApplyBookmarkParameter>;
        /** Selects values of a specific field */
        SelectValues: TActionImplementation<ActionParameter.TSelectValuesParameter>;
        /** Selects matching value of a specific field */
        SelectMatch: TActionImplementation<ActionParameter.TSelectMatchParameter>;
        /** Selects all alternatives values in a specific field */
        SelectAlternative: TActionImplementation<ActionParameter.TFieldParameter>;
        /** Inverts the current selections */
        SelectExcluded: TActionImplementation<ActionParameter.TFieldParameter>;
        /** Selects all possible values in a specific field */
        SelectPossible: TActionImplementation<ActionParameter.TFieldParameter>;
        /** Selects all values of a field. Excluded values are also selected */
        SelectAll: TActionImplementation<ActionParameter.TFieldParameter>;
        /** Step backward in list of selections */
        SelectionBackward: TActionImplementation;
        /** Step forward in list of selections */
        SelectionForward: TActionImplementation;
        /** Clears the selections in a specific field */
        ClearField: TActionImplementation<ActionParameter.TFieldParameter>;
        /** Clears all fields except the specified one */
        ClearOtherFields: TActionImplementation<ActionParameter.TFieldParameter>;
        /** Clears selections of all fields */
        ClearAllFields: TActionImplementation<ActionParameter.TClearAllFieldsParameter>;
        /** Locks specific field */
        LockField: TActionImplementation<ActionParameter.TFieldParameter>;
        /** Locks all currently selected fields */
        LockAllFields: TActionImplementation<ActionParameter.TLockAllFieldsParameter>;
        /** Unlocks a specific field */
        UnlockField: TActionImplementation<ActionParameter.TFieldParameter>;
        /** Unlocks all fields */
        UnlockAllFields: TActionImplementation<ActionParameter.TLockAllFieldsParameter>;
        /** Reloads the data in a app */
        ReloadData: TActionImplementation<ActionParameter.TReloadDataParameter>;
        /** Toggles the fullscreen (in supported browsers) */
        ToggleFullScreen: TActionImplementation<ActionParameter.TToggleFullScreenParameter>;
        /** Sets a certain cell value in a spreadsheet-based BI system*/
        SetCellValue: TActionImplementation<ActionParameter.TSetCellValueParameter>;
    }
}
declare namespace TrueChartAPI {
    interface IFeature<T> extends IFeatureState {
        Feature: T;
        update(feature: T): void;
    }
}
declare namespace TrueChartAPI {
    interface IMediaItem {
        /** Name of the media item (must be unique) */
        name: string;
        /** Media data as base64 encoded string */
        data: string;
        /** Size of the content in bytes */
        size?: number;
        /** Source of the media item (url/fileName) */
        source?: string;
        /** Timestamp of the last modified date */
        lastModified?: Date;
    }
    /** Partial list item with required name */
    type TMediaListItem = Partial<IMediaItem> & Pick<IMediaItem, 'name'>;
    interface IMediaStorage {
        /** Returns a list of all stored media items in a Promise with at least the name of the item */
        list: () => Promise<TMediaListItem[]>;
        /** Returns the media item in a Promise by given name */
        load: (name: string) => Promise<IMediaItem | null>;
        /** Saves/updates the given media item */
        save: (item: IMediaItem) => Promise<boolean>;
        /** Renames the media item */
        rename: (oldName: string, newName: string) => Promise<boolean>;
        /** Removes the media by given name */
        remove: (name: string) => Promise<boolean>;
        /** Removes all media items from the storage */
        clear: () => Promise<boolean>;
    }
}
declare namespace TrueChartAPI {
    /** DataManager interface for defining the data source(s) */
    interface IDataManager {
        /**
         * Adds an asynchronous data source
         * @param dataSource Data source object to be added
         * @returns internal id to the added data context for reference
         */
        addDataSourceAsync(dataSource: TrueChartAPI.IDataSourceAsync): Promise<string>;
        /**
         * Creates and adds an empty datasource object.
         * @param name Initial name of the datasource. If undefined, a random name will be generated. Can be changed later using the Name property.
         * @param sourceReference optional external reference
         * @returns The new datasource object.
         */
        addDataSource(name?: string, sourceReference?: unknown): IDataSource;
        /**
         * Adds a common table
         * @param commonTable Common table object to be added
         * @returns internal id to the added common table for reference
         */
        addCommonTable(commonTable: IDataCommonTable): string;
        /**
         * Removes a previously added datasource
         * @param id Internal id of the datasource
         */
        removeDataSource(id: string): void;
        /**
         * Removes a previously added common table
         * @param id Internal id of the common table
         */
        removeCommonTable(id: string): void;
        /**
         * Gets a previously added common table
         * @param id Internal id of the common table
         * @returns The common table
         */
        getCommonTable(id: string): IDataCommonTable | undefined;
        /**
         * Returns an array with all datasources
         * @return {IDataSource[]}
         */
        getAllDataSources(): (IDataModelBaseAsync)[];
    }
    type TDataValue = string | number | boolean | Date;
    interface IDataCommonTable {
        key: string;
        comments: ICommonInlineComment[];
        description?: string;
        additionalInformation?: string;
    }
    interface ICommonInlineComment {
        dimensionValue: string;
        measureName: string;
        saveName: string;
        value: string;
    }
    interface IComment {
        viewCondition: boolean | (() => boolean);
        references?: ICommentReference[];
    }
    interface ICommentReference {
        dimensionKey: string;
        measureName: string;
    }
    interface IDataSourceAsync {
        load(): Promise<IDataModelBaseAsync>;
        OnDataChanged?: () => void;
    }
}
declare namespace TrueChartAPI {
    /**
     * EventsManager interface
     *
     * warning: when using a selection feature the of the callback will be invoked with the selected dimension field always as a string
     */
    interface IEventsManager {
        /**
         * Subscribes a callback to a specific TrueChart event
         * @param eventType Type of event
         * @param callback Callback function to be triggered when the event occurs
         */
        subscribe(eventType: TEventsType, callback: TVoidFunction<any>): void;
        /**
         * Triggers an internal trueChart action
         * @param action Type of action to be triggered
         * @param parameter Parameter(s) depending on the action
         */
        trigger(action: TTriggerAction, ...parameter: any[]): void;
        /** Global error handler */
        OnError: TVoidFunction<IError> | undefined;
    }
    type TEventsType = 'applySelection' | 'dataUpdated' | 'layoutUpdated' | 'selectData' | 'settingsEditorOpened' | 'settingsEditorClosed' | 'updateLanguage' | 'variablesUpdated';
    type TTriggerAction = 'repaint' | 'openLayoutEditor' | 'openCellSettingsEditor' | 'closeLayoutEditor' | 'destruct' | 'resize';
    /** @deprecated */
    type TVoidFunction<T> = (parameter: T) => void;
    type TPromiseFunction<T, P> = (parameter: T) => Promise<P>;
}
declare namespace TrueChartAPI {
    /**
     * this is the FeatureManager linked to the instance
     */
    interface IFeatureManager extends IFeatureManagerCommon, IFeaturesInternal {
    }
    interface IFeaturesInternal {
        DrillDownDimension: IFeature<IDrillDownDimension>;
        DynamicDimension: IFeature<IDynamicDimension>;
        MasterItem: IFeature<IMasterItem>;
    }
    interface IFeatures extends IFeaturesInternal {
        [key: string]: IFeature<any>;
    }
    interface IFeatureMap {
        [key: string]: any;
        DrillDownDimension: IDrillDownDimension;
        DynamicDimension: IDynamicDimension;
        MasterItem: IMasterItem;
    }
    interface IFeatureState {
        isEnabled: boolean;
        isRegistered: boolean;
        isValid: boolean;
    }
    /**
     * The main interface witch is the parent the FeatureManager per instance and the GlobalFeatureManager
     */
    interface IFeatureManagerCommon {
        getFeatureStates(): {
            [key: string]: IFeatureState;
        };
    }
    interface IDrillDownDimension {
        getDimensionDrilldownLevels: (cid: string) => any[];
    }
    interface IDynamicDimension {
        getDimensionDynamicData: (cid: string) => string[];
    }
    interface IMasterItem {
        isMasterItem: () => boolean;
        isMasterObject: () => boolean;
    }
    interface IVariableContent {
        definition: string;
        value: string;
    }
    interface IVariableStorage {
        listAll(): Promise<Map<string, IVariableContent>>;
        update(data: {
            [key: string]: IVariableContent;
        }): void;
        get(name: string): Promise<string>;
        set(name: string, value: string): Promise<void>;
    }
}
declare namespace TrueChartAPI {
    /** InstanceManager interface */
    interface IInstanceManager {
        /**
         * Registers an existing instance of ITrueChart.
         * @param instance The instance
         * @returns The generated instance ID
         */
        registerTrueChartInstance(instance: TrueChartAPI.ITrueChart): string;
        /**
         * Unregisters an instance.
         * @param instance The instance or instance-id to be removed.
         */
        unregisterTrueChartInstance(instance: string | TrueChartAPI.ITrueChart): void;
        /**
         * Returns the ID of a registered ITrueChart instance
         * @param instance The instance
         * @returns The instance ID
         */
        getId(instance: TrueChartAPI.ITrueChart): string | undefined;
        /**
         * Returns the ITrueChart instance by a given ID
         * @param id The ID of the instance
         * @returns The registered instance
         */
        getTrueChartInstance(id: string): TrueChartAPI.ITrueChart;
        /**
         * Returns all known ids
         * @param except Exclude this ID from the return list
         * @returns A list of all known IDs
         */
        getAllIds(except?: string | TrueChartAPI.ITrueChart): string[];
        /**
         * Returns all registered instances
         * @param except Exclude this ID or instance from the return list
         * @returns A list of all known instances
         */
        getAllInstances(except?: string | TrueChartAPI.ITrueChart): TrueChartAPI.ITrueChart[];
    }
}
declare namespace TrueChartAPI {
    /**
     * LayoutManager interface
     * ... contains all functions to build and modify a layout programmatically
     */
    interface ILayoutManager {
        /** getter only: returns a list of chartTypes available in trueChart like 'table', 'structure' */
        ChartTypes: TChartType[];
        /** getter only: returns a the internal trueChart layout when trueChart is fully initialized */
        Layout: Promise<ILayoutDefinition>;
        /** getter only: return the rootCell of the layout, use this to get the required cell other methods */
        RootCell: Promise<IRootCell>;
        /**
         * add a new column to a grid
         *
         * @param {TrueChartAPI.ICell<TrueChartAPI.IGrid>} cell
         * @param {number} [columnId] - id of the column, we add a column before
         *
         * @throws InvalidParameterError - when given cell is not a grid cell
         */
        addGridColumnBefore(cell: ICell<IGrid>, columnId?: number): void;
        /**
         * add a new row to a grid
         *
         * @param {TrueChartAPI.ICell<TrueChartAPI.IGrid>} cell
         * @param {number} [rowId] - id of the row, we add a row before
         *
         * @throws InvalidParameterError - when given cell is not a grid cell
         */
        addGridRowBefore(cell: ICell<IGrid>, rowId?: number): void;
        /**
         * changes the measures that are declared in the id map, when not defined it will be ignore
         *
         * @param cell - the cell where the changes apply to
         * @param typeMap - map of the dimension id and the representation type
         *
         * @throws InvalidParameterError - when given cell is not a valid cell
         */
        changeMeasureRepresentations(cell: ICell<IMeasureEditable>, typeMap: {
            [key: string]: TRepresentationType;
        }): void;
        /**
         * returns the cell with the given id or null when the cell was not found
         *
         * @param {string} id
         * @return {TrueChartAPI.ICell | null}
         */
        getCellById(id: string): ICell | null;
        /**
         * shorthand to register a callback, that is triggered every time the layout was changed in trueChart, instead you can listen on the
         * 'layoutUpdated' - event
         */
        onLayoutUpdated(callBack: (rootCell: IRootCell) => void): void;
        /**
         * removes the columns of the given grid cell
         *
         * @param {TrueChartAPI.ICell<TrueChartAPI.IGrid>} cell
         * @param {number[]} removeIds - collection of ids to remove starting at 0
         *
         * @throws InvalidParameterError - when given cell is not a grid cell
         */
        removeGridColumn(cell: ICell<IGrid>, removeIds: number[]): void;
        /**
         * removes the rows of the given grid cell
         *
         * @param {TrueChartAPI.ICell<TrueChartAPI.IGrid>} cell
         * @param {number[]} removeIds - collection of ids to remove starting at 0
         *
         * @throws InvalidParameterError - when given cell is not a grid cell
         */
        removeGridRow(cell: ICell<IGrid>, removeIds: number[]): void;
        /**
         * sets the layout to the initial state
         */
        resetLayout(): Promise<void>;
        /**
         * changes that were made on the given cell will be applied
         *
         * @param {TrueChartAPI.ICell} cell
         */
        updateCellSettings(cell: ICell<TAllChartTypes>): void;
        /**
         * change the cell type of a specific cell
         *
         * @param {TrueChartAPI.ICell} cell
         * @param {TrueChartAPI.TChartType} cellType
         * @param {string} [contextId] when no contextId is given it takes the first of the extension
         *
         * @throws {IInvalidParameterError}
         */
        updateCellType(cell: ICell<TAllChartTypes>, cellType: TChartType, contextId?: string): Promise<void>;
        /**
         * changing the cell type of the first cell
         *
         * @param {TrueChartAPI.TChartType} cellType
         * @param {string} [contextId] when no contextId is given it takes the first of the extension
         *
         * @throws {IInvalidParameterError}
         */
        updateFirstCellType(cellType: TChartType, contextId?: string): void;
        /**
         * updates the root cell and repaints trueChart
         *
         * @param {TrueChartAPI.IRootCell} cell
         */
        updateRootCell(cell: TrueChartAPI.IRootCell): void;
    }
    interface ILayoutDefinition {
        id: string;
        rootCell: IRootCell;
    }
    interface IRootCell extends ICell {
        content: IGrid;
    }
    interface ICell<T = IInitial> {
        id: string;
        content: T;
        margin: {
            width: IBoxSpacing;
        };
        padding: {
            width: IBoxSpacing;
        };
    }
    type TAllChartTypes = IInitial | IGrid | IMultiple | IStructureChart | ITable | ITimeChart;
    interface IInitial extends IBaseModel {
        /** equals 'Initial' */
        instanceOf: string;
    }
    /** representation of a multiple, needs a context */
    interface IMultiple extends IBaseModel, IMeasureEditable {
    }
    /** representation of a structure chart, needs a context */
    interface IStructureChart extends IBaseModel, IMeasureEditable {
    }
    /** representation of a table chart, needs a context */
    interface ITable extends IBaseModel, IMeasureEditable {
    }
    /** representation of a time chart, needs a context */
    interface ITimeChart extends IBaseModel, IMeasureEditable {
    }
    /** grid cell */
    interface IGrid extends IBaseModel {
        cellContainers: ICellContainer[];
        columns: IOptimizable[];
        rows: IOptimizable[];
        addColumnBefore: (columnCount: number) => void;
        addRowBefore: (rowCount: number) => void;
        removeColumns: (columns: number[]) => void;
    }
    interface ICellContainer extends IBaseModel {
        cells: ICell[];
    }
    interface IBaseModel {
        instanceOf: string;
    }
    type TChartType = 'blank' | 'button' | 'comment' | 'grid' | 'multiple' | 'structure' | 'table' | 'time' | 'url';
    interface IBoxSpacing {
        bottom: number;
        left: number;
        right: number;
        top: number;
    }
    /** types that where you can configure if the cell is can optimize their dimensions */
    interface IOptimizable {
        isOptimizable: boolean;
    }
    /** that interface is applied to a cell, with a context, that can be changed */
    interface IMeasureEditable {
        /**
         * changes the displayed chart type (representation) at the measure
         *
         * @param { [key: string]: TRepresentationType } ids
         */
        changeMeasureRepresentations(ids: {
            [key: string]: TRepresentationType;
        }): void;
    }
    /** the type that a measure can represent e.g. a bar in the chart */
    type TRepresentationType = 'default' | 'none' | 'line' | 'needle' | 'symbol' | 'symbol_line' | 'value' | 'waterfall';
}
declare namespace TrueChartAPI {
    interface ISettingsKeyValuePair {
        key: string;
        value: any;
    }
}
declare namespace TrueChartAPI {
    /**
     * Use the template manager for all template related interactions with the API
     *
     * With JavaScript you can create a function for applying a template. All you need is a template file, insert by the user, and the grid cell
     * where the template should to be applied. Downloading a template file is possible from the save template dialog in trueChart.
     *
     * @example JavaScript implementation for applying a template
     *
     * 	const applyTemplate = async (templateFile, cell) => {
     * 		const dataMap = await trueChartInstance.TemplateManager.generateDataMap(template);
     * 		// if you like to edit the data mapping, here is the place to go
     * 		return trueChartInstance.TemplateManager.applyTemplate(template)
     * 	}
     *
     */
    interface ITemplateManager {
        /**
         * applies a template to the given cell
         *
         * @param {TrueChartAPI.ICell} cell
         * @param {TrueChartAPI.TTemplate} template
         * @param {TrueChartAPI.ITemplate.IDataMap} dataMap
         *
         * @throws {IInvalidParameterError}
         */
        applyTemplate(cell: ICell, template: TTemplate, dataMap: ITemplate.IDataMap): Promise<void>;
        /**
         * generates a data map from the template and returns that data map
         *
         * @param {TrueChartAPI.TTemplate} template
         * @return {Promise<TrueChartAPI.ITemplate.IDataMap>}
         */
        generateDataMap(template: TTemplate): Promise<ITemplate.IDataMap>;
        /**
         * reads a template from a file and returns that template
         *
         * @param {File} file
         * @return {Promise<TrueChartAPI.TTemplate>}
         *
         * @throws FileNotReadableError
         */
        readFromFile(file: File): Promise<TTemplate>;
    }
}
declare namespace TrueChartAPI {
    interface IToastOptions {
        /** Display the close button (true) */
        closeButton?: boolean;
        /** Escape the message string (true) */
        escapeHtml?: boolean;
        /** Timeout in ms toast remains visible after MouseLeave event (2000) */
        extendedTimeOut?: number;
        /** Default opacity of the toast (0.9) */
        opacity?: number;
        /** Timeout in ms before closing (5000) */
        timeOut?: number;
        /** Prevent showing the toast if a "similar" toast already exists (false) */
        preventDuplicates?: boolean;
    }
    interface ICustomDataDialogOptions {
        /** A localized title for the entry */
        caption: string;
        /** URL or base64 image (anything <image> src can handle) */
        icon?: string;
        /** Function that will be called by the UI when the dialog is being opened. The targetNode
         * 	parameter is the existing container for painting the dialog content into. The implementation is
         * 	responsible for creating/updating the content. It must not modify the targetNode or one of its parents!
         */
        onAttach: (targetNode: HTMLElement) => void;
    }
    /** UserInterfaceManager interface */
    interface IUserInterfaceManager {
        /**
         * Registers a new UI lib for use with trueChart.
         * @param lib The UI library
         * @returns The index of the registered library in the list of all
         *          registered libraries or undefined when the library could
         *          not be loaded
         */
        registerUI(lib: IUserInterface): number | undefined;
        /**
         * Returns a list of the names of all registered UI libraries.
         * The indices of the entries can be used for getUI()
         * @returns List of names, list will be empty when no UI libraries are
         *          registered
         */
        getRegisteredLibNames(): string[];
        /**
         * Returns an instance of the registered UserInterface class.
         * @returns The UI instance or undefined if no UI is active.
         */
        getUI(): IUserInterface | undefined;
        /**
         * Sets the active UI instance.
         * @param index Index in the list of registered user interfaces
         */
        setActiveUI(index: number): void;
        readonly Toaster: {
            success: (message: string, title?: string, options?: IToastOptions, onTextClick?: () => void) => void;
            info: (message: string, title?: string, options?: IToastOptions, onTextClick?: () => void) => void;
            warning: (message: string, title?: string, options?: IToastOptions, onTextClick?: () => void) => void;
            error: (message: string, title?: string, options?: IToastOptions, onTextClick?: () => void) => void;
        };
        /**
         * The 'Data' tab in the UI may display a custom section. The intention is to be able to modify the data binding
         * to the environment (BI system).
         * Setting this to null removes a formerly defined dialog.
         */
        CustomDataDialog: ICustomDataDialogOptions | null;
    }
}
declare namespace TrueChartAPI {
    /**
     * The GlobalFeatureManager is for defining features that apply to all trueChart instances.
     * All global features must be set before creating trueChart instances.
     */
    interface IGlobalFeatureManager extends IFeatureManagerCommon, IGlobalFeatures {
    }
    interface IGlobalFeatures {
        Actions: IFeature<IActionsFeature>;
        Cookies: IFeature<ICookieFeature>;
        CustomContextMenu: IFeature<IContextMenu>;
        DataSourceModifiable: IFeature<IDataSourceModifiable>;
        Expression: IFeature<IExpressionFeature>;
        FileDownload: IFeature<IFileDownloadFeature>;
        Mashup: IFeature<IMashup>;
        Printing: IFeature<IPrinting>;
        Selection: IFeature<ISelectionFeature>;
        Service: IFeature<IServiceFeature>;
        Sheets: IFeature<ISheetsFeature>;
        Snapshot: IFeature<ISnapshot>;
        Storage: IFeature<IStorageFeature>;
        Variables: IFeature<IVariableStorage>;
    }
    /**
     * Actions feature interface
     */
    interface IActionsFeature {
        /**
         * Internally defined function. Returns true when given action(s) are defined in execute object.
         * TODO: move this to internal feature declaration and out of public API
         */
        supports: (actionName: string | string[]) => boolean;
        /**
         * Implementation of the actions supported by the application
         */
        execute: Partial<IActionImplementations>;
        /**
         * In some cases actions may be not permitted, this method must return true in such case.
         */
        preventActions: () => boolean;
    }
    interface IPrinting {
        isPrinting: boolean;
        PrintingData: any;
    }
    interface ISnapshot {
        inPlayMode: () => boolean;
        inStoryMode: () => boolean;
        inSnapshotMode: () => boolean;
        isSnapshotItem: () => boolean;
        getSnapshotData: () => any;
        setSnapshotData: (s: string, data: any) => void;
    }
    interface IMashup {
        isMashup: () => boolean;
    }
    /** BI implementation of the context menu*/
    interface IContextMenu {
        open: (position: IPosition, content: IContextMenuBuilder, trueChartContextMenu: IContextMenuCommon) => void;
    }
    interface IPosition {
        x: number;
        y: number;
    }
    interface IContextEntry {
        disabled: boolean;
        description: string;
        entries?: IContextEntry[];
        handler?: () => void;
        name: string;
        thumbnail: HTMLElement;
    }
    interface IContextMenuCommon {
        close: () => void;
        isOpen: () => boolean;
        open: (builder: IContextMenuBuilder) => void;
    }
    /**
     * will be passed into the open function of your custom context menu feature
     * use it to add entries into the trueChart context menu
     */
    interface IContextMenuBuilder {
        /** instance of the trueChart Core where the context menu was opened */
        readonly CoreInstance: ITrueChart;
        /**
         * adds a new menu entry to the context menu
         * @param category
         */
        addEntry: (entry: IContextMenuEntry, category: TContextMenuCategory) => void;
    }
    /** category under which the menu entry will be added */
    type TContextMenuCategory = 'OBJECT' | 'CELL';
    /** definition of a context menu entry */
    interface IContextMenuEntry {
        /** callback function to execute when user clicked on the entry */
        handler: () => void;
        /** icon of the menu entry */
        icon?: TContextMenuIcon;
        /** the permission level that the user needs */
        level?: TUserRole;
        /** name of the entry, is displayed as text of the entry */
        text: ((language: TLanguage) => string) | string;
        /** text of the tooltip to display */
        tooltip?: ((language: TLanguage) => string) | string;
    }
    /** available context menu icons */
    type TContextMenuIcon = '500px' | 'adjust' | 'adn' | 'align-center' | 'align-justify' | 'align-left' | 'align-right' | 'amazon' |
        'ambulance' | 'anchor' | 'android' | 'angellist' | 'angle-double-down' | 'angle-double-left' | 'angle-double-right' | 'angle-double-up' | 'angle-down' |
        'angle-left' | 'angle-right' | 'angle-up' | 'apple' | 'archive' | 'area-chart' | 'arrow-circle-down' | 'arrow-circle-left' | 'arrow-circle-o-down' | 'arrow-circle-o-left' |
        'arrow-circle-o-right' | 'arrow-circle-o-up' | 'arrow-circle-right' | 'arrow-circle-up' | 'arrow-down' | 'arrow-left' | 'arrow-right' | 'arrow-up' | 'arrows' | 'arrows-alt' | 'arrows-h' | 'arrows-v' | 'asterisk' | 'at' | 'automobile' | 'backward' | 'balance-scale' | 'ban' | 'bank' | 'bar-chart' | 'bar-chart-o' | 'barcode' | 'bars' | 'battery-0' | 'battery-1' | 'battery-2' | 'battery-3' | 'battery-4' | 'battery-empty' | 'battery-full' | 'battery-half' | 'battery-quarter' | 'battery-three-quarters' | 'bed' | 'beer' | 'behance' | 'behance-square' | 'bell' | 'bell-o' | 'bell-slash' | 'bell-slash-o' | 'bicycle' | 'binoculars' | 'birthday-cake' | 'bitbucket' | 'bitbucket-square' | 'bitcoin' | 'black-tie' | 'bluetooth' | 'bluetooth-b' | 'bold' | 'bolt' | 'bomb' | 'book' | 'bookmark' | 'bookmark-o' | 'briefcase' | 'btc' | 'bug' | 'building' | 'building-o' | 'bullhorn' | 'bullseye' | 'bus' | 'buysellads' | 'cab' | 'calculator' | 'calendar' | 'calendar-check-o' | 'calendar-minus-o' | 'calendar-o' | 'calendar-plus-o' | 'calendar-times-o' | 'camera' | 'camera-retro' | 'car' | 'caret-down' | 'caret-left' | 'caret-right' | 'caret-square-o-down' | 'caret-square-o-left' | 'caret-square-o-right' | 'caret-square-o-up' | 'caret-up' | 'cart-arrow-down' | 'cart-plus' | 'cc' | 'cc-amex' | 'cc-diners-club' | 'cc-discover' | 'cc-jcb' | 'cc-mastercard' | 'cc-paypal' | 'cc-stripe' | 'cc-visa' | 'certificate' | 'chain' | 'chain-broken' | 'check' | 'check-circle' | 'check-circle-o' | 'check-square' | 'check-square-o' | 'chevron-circle-down' | 'chevron-circle-left' | 'chevron-circle-right' | 'chevron-circle-up' | 'chevron-down' | 'chevron-left' | 'chevron-right' | 'chevron-up' | 'child' | 'chrome' | 'circle' | 'circle-o' | 'circle-o-notch' | 'circle-thin' | 'clipboard' | 'clock-o' | 'clone' | 'close' | 'cloud' | 'cloud-download' | 'cloud-upload' | 'cny' | 'code' | 'code-fork' | 'codepen' | 'codiepie' | 'coffee' | 'cog' | 'cogs' | 'columns' | 'comment' | 'comment-o' | 'commenting' | 'commenting-o' | 'comments' | 'comments-o' | 'compass' | 'compress' | 'connectdevelop' | 'contao' | 'copy' | 'copyright' | 'creative-commons' | 'credit-card' | 'credit-card-alt' | 'crop' | 'crosshairs' | 'css3' | 'cube' | 'cubes' | 'cut' | 'cutlery' | 'dashboard' | 'dashcube' | 'database' | 'dedent' | 'delicious' | 'desktop' | 'deviantart' | 'diamond' | 'digg' | 'dollar' | 'dot-circle-o' | 'download' | 'dribbble' | 'dropbox' | 'drupal' | 'edge' | 'edit' | 'eject' | 'ellipsis-h' | 'ellipsis-v' | 'empire' | 'envelope' | 'envelope-o' | 'envelope-square' | 'eraser' | 'eur' | 'euro' | 'exchange' | 'exclamation' | 'exclamation-circle' | 'exclamation-triangle' | 'expand' | 'expeditedssl' | 'external-link' | 'external-link-square' | 'eye' | 'eye-slash' | 'eyedropper' | 'facebook' | 'facebook-f' | 'facebook-official' | 'facebook-square' | 'fast-backward' | 'fast-forward' | 'fax' | 'feed' | 'female' | 'fighter-jet' | 'file' | 'file-archive-o' | 'file-audio-o' | 'file-code-o' | 'file-excel-o' | 'file-image-o' | 'file-movie-o' | 'file-o' | 'file-pdf-o' | 'file-photo-o' | 'file-picture-o' | 'file-powerpoint-o' | 'file-sound-o' | 'file-text' | 'file-text-o' | 'file-video-o' | 'file-word-o' | 'file-zip-o' | 'files-o' | 'film' | 'filter' | 'fire' | 'fire-extinguisher' | 'firefox' | 'flag' | 'flag-checkered' | 'flag-o' | 'flash' | 'flask' | 'flickr' | 'floppy-o' | 'folder' | 'folder-o' | 'folder-open' | 'folder-open-o' | 'font' | 'fonticons' | 'fort-awesome' | 'forumbee' | 'forward' | 'foursquare' | 'frown-o' | 'futbol-o' | 'gamepad' | 'gavel' | 'gbp' | 'ge' | 'gear' | 'gears' | 'genderless' | 'get-pocket' | 'gg' | 'gg-circle' | 'gift' | 'git' | 'git-square' | 'github' | 'github-alt' | 'github-square' | 'gittip' | 'glass' | 'globe' | 'google' | 'google-plus' | 'google-plus-square' | 'google-wallet' | 'graduation-cap' | 'gratipay' | 'group' | 'h-square' | 'hacker-news' | 'hand-grab-o' | 'hand-lizard-o' | 'hand-o-down' | 'hand-o-left' | 'hand-o-right' | 'hand-o-up' | 'hand-paper-o' | 'hand-peace-o' | 'hand-pointer-o' | 'hand-rock-o' | 'hand-scissors-o' | 'hand-spock-o' | 'hand-stop-o' | 'hashtag' | 'hdd-o' | 'header' | 'headphones' | 'heart' | 'heart-o' | 'heartbeat' | 'history' | 'home' | 'hospital-o' | 'hotel' | 'hourglass' | 'hourglass-1' | 'hourglass-2' | 'hourglass-3' | 'hourglass-end' | 'hourglass-half' | 'hourglass-o' | 'hourglass-start' | 'houzz' | 'html5' | 'i-cursor' | 'ils' | 'image' | 'inbox' | 'indent' | 'industry' | 'info' | 'info-circle' | 'inr' | 'instagram' | 'institution' | 'internet-explorer' | 'intersex' | 'ioxhost' | 'italic' | 'joomla' | 'jpy' | 'jsfiddle' | 'key' | 'keyboard-o' | 'krw' | 'language' | 'laptop' | 'lastfm' | 'lastfm-square' | 'leaf' | 'leanpub' | 'legal' | 'lemon-o' | 'level-down' | 'level-up' | 'life-bouy' | 'life-buoy' | 'life-ring' | 'life-saver' | 'lightbulb-o' | 'line-chart' | 'link' | 'linkedin' | 'linkedin-square' | 'linux' | 'list' | 'list-alt' | 'list-ol' | 'list-ul' | 'location-arrow' | 'lock' | 'long-arrow-down' | 'long-arrow-left' | 'long-arrow-right' | 'long-arrow-up' | 'magic' | 'magnet' | 'mail-forward' | 'mail-reply' | 'mail-reply-all' | 'male' | 'map' | 'map-marker' | 'map-o' | 'map-pin' | 'map-signs' | 'mars' | 'mars-double' | 'mars-stroke' | 'mars-stroke-h' | 'mars-stroke-v' | 'maxcdn' | 'meanpath' | 'medium' | 'medkit' | 'meh-o' | 'mercury' | 'microphone' | 'microphone-slash' | 'minus' | 'minus-circle' | 'minus-square' | 'minus-square-o' | 'mixcloud' | 'mobile' | 'mobile-phone' | 'modx' | 'money' | 'moon-o' | 'mortar-board' | 'motorcycle' | 'mouse-pointer' | 'music' | 'navicon' | 'neuter' | 'newspaper-o' | 'object-group' | 'object-ungroup' | 'odnoklassniki' | 'odnoklassniki-square' | 'opencart' | 'openid' | 'opera' | 'optin-monster' | 'outdent' | 'pagelines' | 'paint-brush' | 'paper-plane' | 'paper-plane-o' | 'paperclip' | 'paragraph' | 'paste' | 'pause' | 'pause-circle' | 'pause-circle-o' | 'paw' | 'paypal' | 'pencil' | 'pencil-square' | 'pencil-square-o' | 'percent' | 'phone' | 'phone-square' | 'photo' | 'picture-o' | 'pie-chart' | 'pied-piper' | 'pied-piper-alt' | 'pinterest' | 'pinterest-p' | 'pinterest-square' | 'plane' | 'play' | 'play-circle' | 'play-circle-o' | 'plug' | 'plus' | 'plus-circle' | 'plus-square' | 'plus-square-o' | 'power-off' | 'print' | 'product-hunt' | 'puzzle-piece' | 'qq' | 'qrcode' | 'question' | 'question-circle' | 'quote-left' | 'quote-right' | 'ra' | 'random' | 'rebel' | 'recycle' | 'reddit' | 'reddit-alien' | 'reddit-square' | 'refresh' | 'registered' | 'remove' | 'renren' | 'reorder' | 'repeat' | 'reply' | 'reply-all' | 'retweet' | 'rmb' | 'road' | 'rocket' | 'rotate-left' | 'rotate-right' | 'rouble' | 'rss' | 'rss-square' | 'rub' | 'ruble' | 'rupee' | 'safari' | 'save' | 'scissors' | 'scribd' | 'search' | 'search-minus' | 'search-plus' | 'sellsy' | 'send' | 'send-o' | 'server' | 'share' | 'share-alt' | 'share-alt-square' | 'share-square' | 'share-square-o' | 'shekel' | 'sheqel' | 'shield' | 'ship' | 'shirtsinbulk' | 'shopping-bag' | 'shopping-basket' | 'shopping-cart' | 'sign-in' | 'sign-out' | 'signal' | 'simplybuilt' | 'sitemap' | 'skyatlas' | 'skype' | 'slack' | 'sliders' | 'slideshare' | 'smile-o' | 'soccer-ball-o' | 'sort' | 'sort-alpha-asc' | 'sort-alpha-desc' | 'sort-amount-asc' | 'sort-amount-desc' | 'sort-asc' | 'sort-desc' | 'sort-down' | 'sort-numeric-asc' | 'sort-numeric-desc' | 'sort-up' | 'soundcloud' | 'space-shuttle' | 'spinner' | 'spoon' | 'spotify' | 'square' | 'square-o' | 'stack-exchange' | 'stack-overflow' | 'star' | 'star-half' | 'star-half-empty' | 'star-half-full' | 'star-half-o' | 'star-o' | 'steam' | 'steam-square' | 'step-backward' | 'step-forward' | 'stethoscope' | 'sticky-note' | 'sticky-note-o' | 'stop' | 'stop-circle' | 'stop-circle-o' | 'street-view' | 'strikethrough' | 'stumbleupon' | 'stumbleupon-circle' | 'subscript' | 'subway' | 'suitcase' | 'sun-o' | 'superscript' | 'support' | 'table' | 'tablet' | 'tachometer' | 'tag' | 'tags' | 'tasks' | 'taxi' | 'television' | 'tencent-weibo' | 'terminal' | 'text-height' | 'text-width' | 'th' | 'th-large' | 'th-list' | 'thermometer-half' | 'thumb-tack' | 'thumbs-down' | 'thumbs-o-down' | 'thumbs-o-up' | 'thumbs-up' | 'ticket' | 'times' | 'times-circle' | 'times-circle-o' | 'tint' | 'toggle-down' | 'toggle-left' | 'toggle-off' | 'toggle-on' | 'toggle-right' | 'toggle-up' | 'trademark' | 'train' | 'transgender' | 'transgender-alt' | 'trash' | 'trash-o' | 'tree' | 'trello' | 'tripadvisor' | 'trophy' | 'truck' | 'try' | 'tty' | 'tumblr' | 'tumblr-square' | 'turkish-lira' | 'tv' | 'twitch' | 'twitter' | 'twitter-square' | 'umbrella' | 'underline' | 'undo' | 'university' | 'unlink' | 'unlock' | 'unlock-alt' | 'unsorted' | 'upload' | 'usb' | 'usd' | 'user' | 'user-md' | 'user-plus' | 'user-secret' | 'user-times' | 'users' | 'venus' | 'venus-double' | 'venus-mars' | 'viacoin' | 'video-camera' | 'vimeo' | 'vimeo-square' | 'vine' | 'vk' | 'volume-down' | 'volume-off' | 'volume-up' | 'warning' | 'wechat' | 'weibo' | 'weixin' | 'whatsapp' | 'wheelchair' | 'wifi' | 'wikipedia-w' | 'windows' | 'won' | 'wordpress' | 'wrench' | 'xing' | 'xing-square' | 'y-combinator' | 'y-combinator-square' | 'yahoo' | 'yc' | 'yc-square' | 'yelp' | 'yen' | 'youtube' | 'youtube-play' | 'youtube-square';
    /**
     * this needs to be implemented when using the localStorage
     * when you use trueChart without service and use the storage you need to implement the sync storage
     */
    interface IStorageFeature {
        extension: IExtStorage;
        document: IStorage;
        media?: IMediaStorage;
        sync?: ISyncStorage;
    }
    /** Implement the cookie storage if your environment doesn't support document.cookie, i.e. in a sandboxed IFrame */
    interface ICookieFeature {
        readCookie: (name: string) => string | null;
        setCookie: (name: string, value: string, path?: string) => void;
    }
    interface ISelectionFeature {
        /**
         * Registers an listener callback which will be called on selection
         *
         * @param listener - Event listener, which will be called on selection
         *
         * @return - Returns callback which can be executed to unsubscribe the event listener
         */
        onSelection(listener: TVoidFunction<ActionTriggerData.ISelection[]>): TVoidFunction<never>;
    }
    interface ISyncStorage extends IStorage {
        destroy: () => Promise<void>;
    }
    interface IStorage {
        load: () => Promise<string | any>;
        save: (data: (string | any)) => Promise<void>;
    }
    interface IExtStorage {
        load: (key: string) => Promise<IExtensionDefinitionResponseObject>;
        save: (key: string, data: IExtensionDefinitionResponseObject) => Promise<void>;
    }
    interface IExpressionFeature {
        getValue(expr: string): Promise<string>;
        type: TrueChartAPI.TExpressionType;
    }
    /**
     * Feature to download a file e.g. a template from trueChart, by default we use the browser api for this, in some cases there need to be triggered an
     * action, in case you like to override this behaviour you can do it here
     */
    interface IFileDownloadFeature {
        /**
         * is triggered when a file need to be saved
         *
         * @param {string} data - data that needs to be saved
         * @param {string} fileName - name of the file
         * @param {string} [type] - mime type, default: 'text/plain;charset=utf-8'
         */
        save: (data: string, fileName: string, type?: string) => void;
    }
    interface IServiceFeature {
        /** hostname of the service - if the service is on the same host as the bi-system you could use window.location.hostname */
        serviceHost: string;
        /** port where the service is listening */
        servicePort: number;
        /** path where the service could be found */
        servicePath?: string;
    }
    /**
     * Feature to get a list of the available report sheets. They will be displayed for instance in the dropdown list of the "Go to sheet" cell actions dialog.
    */
    interface ISheetsFeature {
        /** returns a Promise of an Array of all available sheets */
        getSheets: () => Promise<IIdentifiableObject[]>;
    }
    interface IExtensionDefinitionResponseObject {
        comments: string;
        contexts: string | null;
        dataContexts: string;
        hicoObject: string | null;
        inlineComments: string;
        layoutDefinition: string;
        rootModel: string;
        serverId: string | null;
        version?: string;
    }
    interface IDataSourceModifiable {
        createDataSource: (dataSource: ITemplate.IDataContext) => string;
        updateDataSource: (dataSource: ITemplate.IDataContext) => void;
    }
}
