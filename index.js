import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path ="./data.json";

const isValidDate = (date) => {
    const startDate = moment("2010-01-01");
    const endDate = moment("2024-12-20");
    return date.isBetween(startDate, endDate, null, "[]");
};

const markCommit = async (date) => {
    const data = { date: date.toISOString() };
    await jsonfile.writeFile(path, data);

    const git = simpleGit();
    await git.add(path);
    await git.commit(date.toISOString(), {"--date": date.toISOString()});
}

const makeCommits = async (n) => {
    const git = simpleGit();

    const totalWeeks = moment("2024-12-20").diff(moment("2010-01-01"), "weeks");

    for (let i = 0; i < n; i++) {
        const randomWWeeks = random.int(0, totalWeeks);
        const randomDays = random.int(0, 6);
        const randomDate = moment("2010-01-01")
            .add(randomWWeeks, "weeks")
            .add(randomDays, "days");

        if (isValidDate(randomDate)) {
            console.log(`Creating commit: ${randomDate.toISOString()}`);
            await markCommit(randomDate);
        } else {
            console.log(`Invalid date: ${randomDate.toISOString()}. Skipping...`);
        }
    }

    console.log("Pushing all commits...");
    await git.push();
}

makeCommits(100000);