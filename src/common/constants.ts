export class Constants {
    public static MONGODB_PORT = '27017';
    public static MONGODB_CONNECTION = `mongodb://localhost:${Constants.MONGODB_PORT}/lessons`;

    // Swagger
    public static API_TITLE = 'Lessons Scheduling API';
    public static API_TAG = 'Docs';
    public static API_AUTH_TYPE = 'http';
    public static API_AUTH_SCHEMA = 'bearer';
    public static API_AUTH_BEARER_FORMAT = 'JWT';
    public static API_AUTH_PATH = 'header';
    public static API_AUTH_NAME = 'Authorization';

    // Paths
    public static LESSON = 'lesson';
    public static LESSON_TAG = 'Lesson';

    // CRUD Paths
    public static ADD_PATH = 'add';
    public static UPDATE_PATH = 'update';
    public static BY_ID_PATH = '/:id';

    // Time intervalse
    public static DAY_TIME_INTERVAL = 24 * 60 * 60 * 1000;
    public static WEEK_TIME_INTERVAL = 7 * 24 * 60 * 60 * 1000;
}
