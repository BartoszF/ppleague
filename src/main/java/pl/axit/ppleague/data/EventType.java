package pl.axit.ppleague.data;

import java.util.Arrays;
import java.util.Optional;

public enum EventType {
    MATCH_INV(1, "INV"),
    MATCH_CANCEL(2, "MATCH_CANCEL");

    private final String name;
    private final Integer id;

    private EventType(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public static Optional<EventType> getById(Integer id) {
        return Arrays.stream(values()).filter((ev) -> ev.id.equals(id)).findFirst();
    }

    public Integer getId() {
        return this.id;
    }
}
