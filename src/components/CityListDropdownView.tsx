import { List } from "@raycast/api"
import { format } from "date-fns"
import { getDateList } from "../common/getDateList"

export const CityListDropdownView = () => {
    const currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    const dates = getDateList(currentDate, 12)

    return (
        <List.Dropdown tooltip="Select a date" defaultValue={currentDate.toISOString()}>
            {dates.map((date) => (
                <List.Dropdown.Item
                    key={date.toISOString()}
                    title={`${format(date, "yyyy/MM/dd")}${
                        date.toISOString() === currentDate.toISOString() ? " (Today)" : ""
                    }`}
                    value={date.toISOString()}
                />
            ))}
        </List.Dropdown>
    )
}
