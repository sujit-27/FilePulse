package com.myproject.FilePulse.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_credits")
public class UserCredits {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String clerkId;
    private int credits;
    private String plan;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getClerkId() {
        return clerkId;
    }

    public void setClerkId(String clerkId) {
        this.clerkId = clerkId;
    }

    public int getCredits() {
        return credits;
    }

    public void setCredits(int credits) {
        this.credits = credits;
    }

    public String getPlan() {
        return plan;
    }

    public void setPlan(String plan) {
        this.plan = plan;
    }

    @Override
    public String toString() {
        return "UserCredits{" +
                "id=" + id +
                ", clerkId='" + clerkId + '\'' +
                ", credits=" + credits +
                ", plan='" + plan + '\'' +
                '}';
    }
}
