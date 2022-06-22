export default class QueryMap {
    constructor(app) {
        this.boundHandleTag = this.handleTag.bind(this);
        this.boundHandleUntag = this.handleUntag.bind(this);
        this.app = app;
        this.queryMap = new Map();
        this.app.on("add", this.onAdd.bind(this));
        this.app.on("remove", this.onRemove.bind(this));
    }
    getEntities(query) {
        if (!this.queryMap.has(query)) {
            const entitySet = new Set();
            this.app.entities.forEach(entity => {
                if (QueryMap.matchesQuery(entity, query)) {
                    entitySet.add(entity);
                }
            });
            this.queryMap.set(query, entitySet);
        }
        return this.queryMap.get(query);
    }
    onAdd(entity) {
        this.addToMap(entity);
    }
    onRemove(entity) {
        this.removeFromMap(entity);
    }
    addToMap(entity) {
        this.queryMap.forEach((entities, query) => {
            const matches = QueryMap.matchesQuery(entity, query);
            if (matches) {
                entities.add(entity);
            }
        });
    }
    removeFromMap(entity) {
        this.queryMap.forEach((entities) => {
            if (entities.has(entity)) {
                entities.delete(entity);
            }
        });
    }
    handleTag(tag, entity) {
        this.addToMap(entity);
    }
    handleUntag(tag, entity) {
        this.queryMap.forEach((entities, query) => {
            if (entities.has(entity) && query.includes(tag)) {
                entities.delete(entity);
            }
        });
    }
    static matchesQuery(entity, query) {
        if (Array.isArray(query)) {
            return query.every(q => entity.tags.has(q));
        }
        return entity.tags.has(query);
    }
}