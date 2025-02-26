/**
 * 所有动作类型的枚举，用于索引
 */
export enum ActionType {
    ADD_REQUIREMENT = 'UserRequirement',
    WRITE_PRD = 'WritePRD',
    WRITE_PRD_REVIEW = 'WritePRDReview',
    WRITE_DESIGN = 'WriteDesign',
    DESIGN_REVIEW = 'DesignReview',
    WRITE_CODE = 'WriteCode',
    WRITE_CODE_REVIEW = 'WriteCodeReview',
    WRITE_TEST = 'WriteTest',
    RUN_CODE = 'RunCode',
    DEBUG_ERROR = 'DebugError',
    WRITE_TASKS = 'WriteTasks',
    SEARCH_AND_SUMMARIZE = 'SearchAndSummarize',
    COLLECT_LINKS = 'CollectLinks',
    WEB_BROWSE_AND_SUMMARIZE = 'WebBrowseAndSummarize',
    CONDUCT_RESEARCH = 'ConductResearch',
    EXECUTE_NB_CODE = 'ExecuteNbCode',
    WRITE_ANALYSIS_CODE = 'WriteAnalysisCode',
    WRITE_PLAN = 'WritePlan',
    WRITE_PLAN_AND_CHANGELOG = 'WritePlanAndChangelog',
    USER_REQUIREMENT='UserRequirement',
    SUMMARIZE_CODE = 'SummarizeCode',
    PREPARE_DOCUMENTS='PrepareDocuments',
    FIX_BUG='FixBug',
    TASK_DISPATCHER='TaskDispatcher',
    THINK='Think',
    NULL = 'NULL'
}

